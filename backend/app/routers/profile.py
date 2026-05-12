from fastapi import APIRouter
from app.services.github import fetch_user, fetch_repos, fetch_events
from app.services.analyzer import (
    detect_dev_type,
    get_top_languages,
    get_top_repos,
    get_checklist,
    get_activity_summary,
)
from app.models.profile import ProfileReport

router = APIRouter(prefix="/api", tags=["profile"])


@router.get("/profile/{username}", response_model=ProfileReport)
async def get_profile(username: str):
    user, repos, events = (
        await fetch_user(username),
        await fetch_repos(username),
        await fetch_events(username),
    )

    return ProfileReport(
        username=user["login"],
        name=user.get("name"),
        bio=user.get("bio"),
        avatar_url=user["avatar_url"],
        location=user.get("location"),
        blog=user.get("blog") or None,
        followers=user["followers"],
        following=user["following"],
        public_repos=user["public_repos"],
        joined_year=int(user["created_at"][:4]),
        dev_type=detect_dev_type(repos),
        activity=get_activity_summary(events, repos),
        languages=get_top_languages(repos),
        top_repos=get_top_repos(repos),
        checklist=get_checklist(user),
    )