from fastapi import APIRouter
from app.services.github import (
    fetch_user,
    fetch_repos,
    fetch_events,
    fetch_all_commits,
    fetch_contribution_calendar,
)
from app.services.analyzer import (
    detect_dev_type,
    get_top_languages,
    get_top_repos,
    get_checklist,
    get_activity_summary,
)
from app.models.profile import ProfileReport

router = APIRouter(prefix="/api", tags=["compare"])


async def build_profile(username: str) -> ProfileReport:
    user, repos, events = (
        await fetch_user(username),
        await fetch_repos(username),
        await fetch_events(username),
    )

    commit_counts = await fetch_all_commits(username, repos)
    heatmap = await fetch_contribution_calendar(username)

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
        activity=get_activity_summary(events, repos, commit_counts),
        heatmap=heatmap,
        languages=get_top_languages(repos),
        top_repos=get_top_repos(repos, commit_counts),
        checklist=get_checklist(user),
    )


@router.get("/compare")
async def compare_profiles(user1: str, user2: str):
    profile1 = await build_profile(user1)
    profile2 = await build_profile(user2)

    return {
        "profile1": profile1,
        "profile2": profile2,
    }