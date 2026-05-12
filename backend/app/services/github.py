import httpx
import os
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

GITHUB_API = "https://api.github.com"


def get_headers():
    token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def fetch_user(username: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{GITHUB_API}/users/{username}",
            headers=get_headers()
        )

    if res.status_code == 404:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found.")
    if res.status_code == 403:
        raise HTTPException(status_code=429, detail="GitHub API rate limit hit.")
    if not res.is_success:
        raise HTTPException(status_code=502, detail="GitHub API error.")

    return res.json()


async def fetch_repos(username: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{GITHUB_API}/users/{username}/repos",
            headers=get_headers(),
            params={"per_page": 100, "sort": "updated"},
        )

    if not res.is_success:
        return []

    return res.json()


async def fetch_events(username: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{GITHUB_API}/users/{username}/events/public",
            headers=get_headers(),
            params={"per_page": 100},
        )

    if not res.is_success:
        return []

    return res.json()


async def fetch_all_commits(username: str, repos: list[dict]) -> dict[str, int]:
    top_repos = repos[:10]
    commit_counts = {}

    async with httpx.AsyncClient() as client:
        for repo in top_repos:
            res = await client.get(
                f"{GITHUB_API}/repos/{username}/{repo['name']}/commits",
                headers=get_headers(),
                params={"author": username, "per_page": 100},
            )
            if res.is_success:
                commit_counts[repo["name"]] = len(res.json())
            else:
                commit_counts[repo["name"]] = 0

    return commit_counts


async def fetch_contribution_calendar(username: str) -> dict[str, int]:
    query = """
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
    """

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.github.com/graphql",
            headers=get_headers(),
            json={"query": query, "variables": {"username": username}},
        )

    if not res.is_success:
        return {}

    data = res.json()
    weeks = (
        data.get("data", {})
            .get("user", {})
            .get("contributionsCollection", {})
            .get("contributionCalendar", {})
            .get("weeks", [])
    )

    day_counts: dict[str, int] = {}
    for week in weeks:
        for day in week.get("contributionDays", []):
            day_counts[day["date"]] = day["contributionCount"]

    return day_counts