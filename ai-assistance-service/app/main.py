from __future__ import annotations

import math
import re
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="CivicConnect AI Assistance Service", version="1.0.0")

class HistoricalReport(BaseModel):
    id: str
    title: str
    description: str
    category: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    created_at: Optional[str] = None

class AnalyzeComplaintRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    historical_reports: List[HistoricalReport] = Field(default_factory=list)

class AnalyzeComplaintResponse(BaseModel):
    summary: str
    category: str
    recommended_department: str
    priority: str
    confidence: float
    duplicate_detected: bool
    duplicate_complaint_id: Optional[str] = None
    duplicate_similarity_score: float = 0.0

DEPARTMENT_RULES = {
    "Public Works": ["pothole", "road", "street", "traffic", "bridge", "sign", "drain", "sidewalk", "roadway", "repair"],
    "Water Authority": ["water", "leak", "pipe", "pipeline", "sewer", "drainage", "contamination", "overflow"],
    "Electricity": ["power", "electric", "streetlight", "transformer", "outage", "wiring", "electrical"],
    "Police": ["theft", "robbery", "harassment", "assault", "noise", "violence", "vandalism", "suspicious"],
    "Municipality": ["garbage", "waste", "sanitation", "health", "cleanliness", "dump", "odor", "hazard"],
}

SEVERITY_HINTS = {
    "CRITICAL": ["fire", "flood", "collapse", "electrocution", "life-threatening", "emergency"],
    "HIGH": ["leak", "theft", "assault", "accident", "urgent", "danger", "severe", "immediate"],
    "MEDIUM": ["road", "water", "streetlight", "noise", "garbage", "overflow", "broken"],
    "LOW": ["minor", "slow", "delay", "small", "cosmetic"],
}

def contains_word(keyword: str, text: str) -> bool:
    """Matches keyword as a whole word using regex word boundaries (\\b)."""
    return bool(re.search(rf"\b{re.escape(keyword)}\b", text, re.IGNORECASE))

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance in meters between two coordinates on Earth."""
    R = 6371000.0  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-assistance-service"}

@app.post("/analyze", response_model=AnalyzeComplaintResponse)
def analyze(request: AnalyzeComplaintRequest) -> AnalyzeComplaintResponse:
    full_text = f"{request.title} {request.description}"
    tokens = [t.lower() for t in re.findall(r"\b\w{3,}\b", full_text)]

    department_scores: dict[str, int] = {name: 0 for name in DEPARTMENT_RULES}
    for dept, keywords in DEPARTMENT_RULES.items():
        score = sum(3 for keyword in keywords if contains_word(keyword, full_text))
        department_scores[dept] = score

    highest_score = max(department_scores.values())

    if highest_score == 0:
        department = "General"
        confidence = 0.20
    else:
        department = max(department_scores, key=department_scores.get)
        confidence = min(0.98, 0.45 + (highest_score * 0.09))

    priority = "LOW"
    for level, keywords in SEVERITY_HINTS.items():
        if any(contains_word(keyword, full_text) for keyword in keywords):
            priority = level
            break

    duplicate_detected = False
    duplicate_complaint_id = None
    highest_similarity = 0.0

    request_tokens_set = set(tokens)

    for report in request.historical_reports:
        report_text = f"{report.title} {report.description}"
        report_tokens = [t.lower() for t in re.findall(r"\b\w{3,}\b", report_text)]
        report_tokens_set = set(report_tokens)

        if not report_tokens_set or not request_tokens_set:
            continue

        overlap = len(request_tokens_set.intersection(report_tokens_set))
        similarity_score = overlap / max(len(request_tokens_set), len(report_tokens_set))

        # Location distance evaluation using Haversine
        if (
            request.location_lat is not None
            and request.location_lng is not None
            and report.location_lat is not None
            and report.location_lng is not None
        ):
            dist_m = haversine_distance(
                request.location_lat,
                request.location_lng,
                report.location_lat,
                report.location_lng,
            )
            # 100 m = strong duplicate signal
            if dist_m <= 100.0:
                similarity_score += 0.35
            elif dist_m <= 500.0:
                similarity_score += 0.15
            elif dist_m > 2000.0:
                similarity_score -= 0.30

        # Boost if same category predicted/assigned
        if report.category and department != "General" and report.category == department:
            similarity_score += 0.10

        similarity_score = max(0.0, min(1.0, similarity_score))

        if similarity_score > highest_similarity:
            highest_similarity = similarity_score
            if similarity_score >= 0.60:
                duplicate_detected = True
                duplicate_complaint_id = report.id

    # Better summarization: extract sentences with keywords, fallback to first few words
    sentences = [s.strip() for s in re.split(r"[.!?]+", request.description) if s.strip()]
    all_keywords = [
        kw for sublist in DEPARTMENT_RULES.values() for kw in sublist
    ] + [
        kw for sublist in SEVERITY_HINTS.values() for kw in sublist
    ]
    summary_sentences = []
    for s in sentences:
        if any(contains_word(kw, s) for kw in all_keywords):
            summary_sentences.append(s)
            if len(summary_sentences) >= 2:
                break

    if not summary_sentences and sentences:
        summary_sentences = [sentences[0]]

    summary = ". ".join(summary_sentences)
    if not summary:
        summary = " ".join(request.description.strip().split())[:177] + "..."
    elif len(summary) > 200:
        summary = summary[:197] + "..."

    return AnalyzeComplaintResponse(
        summary=summary,
        category=department,
        recommended_department=department,
        priority=priority,
        confidence=round(confidence, 2),
        duplicate_detected=duplicate_detected,
        duplicate_complaint_id=duplicate_complaint_id,
        duplicate_similarity_score=round(highest_similarity, 2),
    )
