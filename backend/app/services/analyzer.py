def get_top_repos(repos: list[dict], commit_counts: dict[str, int]) -> list[RepoSummary]:
    # rank by commits first, then stars as tiebreaker
    sorted_repos = sorted(
        repos,
        key=lambda r: (commit_counts.get(r["name"], 0), r["stargazers_count"]),
        reverse=True
    )

    return [
        RepoSummary(
            name=r["name"],
            description=r.get("description"),
            language=r.get("language"),
            stars=r["stargazers_count"],
            forks=r["forks_count"],
            url=r["html_url"],
        )
        for r in sorted_repos[:3]
    ]


def get_activity_summary(events: list[dict], repos: list[dict], commit_counts: dict[str, int]) -> ActivitySummary:
    total_commits = sum(commit_counts.values())

    month_counts: Counter = Counter()
    for e in events:
        if e["type"] == "PushEvent":
            month = datetime.fromisoformat(e["created_at"].replace("Z", "+00:00")).strftime("%B %Y")
            month_counts[month] += len(e.get("payload", {}).get("commits", []))

    most_active_month = month_counts.most_common(1)[0][0] if month_counts else None

    last_pushed = None
    if repos:
        latest = max(repos, key=lambda r: r["pushed_at"] or "")
        if latest["pushed_at"]:
            last_pushed = datetime.fromisoformat(
                latest["pushed_at"].replace("Z", "+00:00")
            ).strftime("%b %d, %Y")

    active_days = len({
        datetime.fromisoformat(e["created_at"].replace("Z", "+00:00")).date()
        for e in events
    })

    return ActivitySummary(
        total_commits=total_commits,
        most_active_month=most_active_month,
        last_pushed=last_pushed,
        active_days=active_days,
    )