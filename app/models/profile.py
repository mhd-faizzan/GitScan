from pydantic import BaseModel
from typing import Optional


class RepoSummary(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    stars: int
    forks: int
    url: str


class LanguageStat(BaseModel):
    name: str
    percentage: int
    color: str


class Scores(BaseModel):
    activity: int
    quality: int
    consistency: int
    health: int
    hire: int


class HealthCheck(BaseModel):
    label: str
    passed: bool


class ProfileReport(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: str
    location: Optional[str] = None
    blog: Optional[str] = None
    followers: int
    public_repos: int
    joined_year: int
    dev_type: str
    scores: Scores
    languages: list[LanguageStat]
    top_repos: list[RepoSummary]
    checklist: list[HealthCheck]