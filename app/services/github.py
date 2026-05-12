import httpx
from fastapi import HTTPException

GITHUB_API = "https://api.github.com"

HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}


async def fetch_user(username: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{GITHUB_API}/users/{username}", headers=HEADERS)

    if res.status_code == 404:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found.")
    if res.status_code == 403:
        raise HTTPException(status_code=429, detail="GitHub API rate limit hit. Try again in a minute.")
    if not res.is_success:
        raise HTTPException(status_code=502, detail="GitHub API error.")

    return res.json()


async def fetch_repos(username: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{GITHUB_API}/users/{username}/repos",
            headers=HEADERS,
            params={"per_page": 100, "sort": "updated"},
        )

    if not res.is_success:
        return []

    return res.json()


async def fetch_events(username: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{GITHUB_API}/users/{username}/events/public",
            headers=HEADERS,
            params={"per_page": 100},
        )

    # not a hard failure — private/new accounts have no public events
    if not res.is_success:
        return []

    return res.json()