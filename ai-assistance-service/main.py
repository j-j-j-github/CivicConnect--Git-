from __future__ import annotations

from collections import Counter
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="CivicConnect AI Assistance Service", version="1.0.0")


class AnalyzeComplaintRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    location: Optional[str] = None
    historical_reports: List[str] = Field(default_factory=list)


class AnalyzeComplaintResponse(BaseModel):
    department: str
    category: str
    priority: str
    confidence: float
    summary: str
    duplicate_check: dict


DEPARTMENT_RULES = {
    "Public Works": ["pothole", "road", "street", "traffic", "bridge", "sign", "drain", "sidewalk", "repair"],
    "Water Authority": ["water", "leak", "pipe", "pipeline", "sewer", "drainage", "contamination", "overflow"],
    "Electricity": ["power", "electric", "streetlight", "transformer", "outage", "wiring", "electrical"],
    "Police": ["theft", "robbery", "harassment", "assault", "noise", "violence", "vandalism", "suspicious"],
    "Municipality": ["garbage", "waste", "sanitation", "health", "cleanliness", "dump", "odor", "hazard"],
}

SEVERITY_HINTS = {
    "high": ["fire", "leak", "flood", "theft", "assault", "accident", "collapse", "electrocution"],
    "medium": ["road", "water", "streetlight", "noise", "garbage", "overflow", "broken"],
    "low": ["minor", "slow", "delay", "small", "cosmetic"],
}


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-assistance-service"}


@app.post("/analyze", response_model=AnalyzeComplaintResponse)
def analyze(request: AnalyzeComplaintRequest) -> AnalyzeComplaintResponse:
    full_text = f"{request.title} {request.description} {request.location or ''}".lower()
    tokens = [token for token in full_text.replace("/", " ").split() if token.isalpha()]

    department_scores = {name: 0 for name in DEPARTMENT_RULES}
    for dept, keywords in DEPARTMENT_RULES.items():
        score = sum(3 for keyword in keywords if keyword in full_text)
        if score == 0:
            score = sum(1 for token in tokens if token in keywords)
        department_scores[dept] = score

    department = max(department_scores, key=department_scores.get)
    largest_score = department_scores[department]
    confidence = min(0.98, 0.45 + (largest_score * 0.09))

    priority = "low"
    for level, keywords in SEVERITY_HINTS.items():
        if any(keyword in full_text for keyword in keywords):
            priority = level
            break

    if any(word in full_text for word in ["urgent", "danger", "emergency", "immediate", "severe", "life"]):
        priority = "high"

    token_counter = Counter(tokens)
    duplicate_matches = []
    for report in request.historical_reports:
        report_tokens = {token for token in report.lower().replace("/", " ").split() if token.isalpha()}
        overlap = len(set(token_counter).intersection(report_tokens))
        if overlap >= 2:
            duplicate_matches.append(report)

    summary = " ".join(request.description.strip().split())
    if len(summary) > 180:
        summary = summary[:177].rstrip() + "..."

    return AnalyzeComplaintResponse(
        department=department,
        category=department,
        priority=priority,
        confidence=round(confidence, 2),
        summary=summary,
        duplicate_check={
            "is_duplicate": bool(duplicate_matches),
            "matched_reports": duplicate_matches[:3],
            "match_count": len(duplicate_matches),
        },
    )
