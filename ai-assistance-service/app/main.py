from __future__ import annotations

import math
from typing import List, Optional
from collections import Counter

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

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Very rough euclidean distance for duplicate checking purposes
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-assistance-service"}

@app.post("/analyze", response_model=AnalyzeComplaintResponse)
def analyze(request: AnalyzeComplaintRequest) -> AnalyzeComplaintResponse:
    full_text = f"{request.title} {request.description}".lower()
    tokens = [token for token in full_text.replace("/", " ").split() if token.isalpha() and len(token) > 2]
    token_counter = Counter(tokens)

    department_scores: dict[str, int] = {name: 0 for name in DEPARTMENT_RULES}
    for dept, keywords in DEPARTMENT_RULES.items():
        score = sum(3 for keyword in keywords if keyword in full_text)
        if score == 0:
            score = sum(1 for token in tokens if token in keywords)
        department_scores[dept] = score

    department = max(department_scores, key=department_scores.get)
    largest_score = department_scores[department]

    confidence = min(0.98, 0.45 + (largest_score * 0.09))
    if largest_score == 0:
        confidence = 0.3

    priority = "LOW"
    for level, keywords in SEVERITY_HINTS.items():
        if any(keyword in full_text for keyword in keywords):
            priority = level
            break

    duplicate_detected = False
    duplicate_complaint_id = None
    highest_similarity = 0.0

    for report in request.historical_reports:
        report_text = f"{report.title} {report.description}".lower()
        report_tokens = [t for t in report_text.replace("/", " ").split() if t.isalpha() and len(t) > 2]
        
        if not report_tokens or not tokens:
            continue
            
        overlap = len(set(tokens).intersection(set(report_tokens)))
        similarity_score = overlap / max(len(set(tokens)), len(set(report_tokens)))
        
        # Boost similarity if locations are very close
        if request.location_lat and request.location_lng and report.location_lat and report.location_lng:
            dist = calculate_distance(request.location_lat, request.location_lng, report.location_lat, report.location_lng)
            if dist < 0.001:  # Roughly ~100m
                similarity_score += 0.2
            elif dist > 0.01: # Far away, likely not a duplicate despite similar words
                similarity_score -= 0.3
                
        # Boost if same category predicted/assigned
        if report.category and report.category == department:
            similarity_score += 0.1
            
        if similarity_score > highest_similarity:
            highest_similarity = similarity_score
            if similarity_score > 0.6:  # Threshold for duplicate
                duplicate_detected = True
                duplicate_complaint_id = report.id

    # Better summarization: extract sentences with keywords, fallback to first few words
    sentences = [s.strip() for s in request.description.replace('!', '.').replace('?', '.').split('.') if s.strip()]
    summary_sentences = []
    for s in sentences:
        s_lower = s.lower()
        if any(k in s_lower for k in [word for sublist in SEVERITY_HINTS.values() for word in sublist] + [word for sublist in DEPARTMENT_RULES.values() for word in sublist]):
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
