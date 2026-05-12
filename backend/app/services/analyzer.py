from datetime import datetime, timezone
from collections import Counter
from app.models.profile import ActivitySummary, LanguageStat, HealthCheck, RepoSummary

LANG_COLORS = {
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "Python":     "#3572A5",
    "HTML":       "#e34c26",
    "CSS":        "#563d7c",
    "Java":       "#b07219",
    "Go":         "#00ADD8",
    "Rust":       "#dea584",
    "Ruby":       "#701516",
    "PHP":        "#4F5D95",
    "C++":        "#f34b7d",
    "C":          "#555555",
    "Swift":      "#F05138",
    "Kotlin":     "#A97BFF",
    "Shell":      "#89e051",
}


def detect_dev_type(repos: list[dict]) -> str:
    lang_counts: dict[str, int] = {}

    for repo in repos:
        lang = repo.get("language")
        if lang:
            lang_counts[lang] = lang_counts.get(lang, 0) + 1

    total = sum(lang_counts.values())
    if not total:
        return "Developer"

    def pct(lang):
        return (lang_counts.get(lang, 0) / total) * 100

    js_ts = pct("JavaScript") + pct("TypeScript")

    if pct("Python") > 40:                                      return "ML / AI Engineer"
    if js_ts > 50:                                               return "Frontend Developer"
    if pct("Python") > 20 and js_ts > 20:                       return "Full Stack Developer"
    if pct("Java") > 30 or pct("Go") > 30 or pct("Rust") > 30: return "Backend Engineer"
    if pct("HTML") + pct("CSS") > 40:                           return "Web Designer"

    return "Polyglot Developer"


def get_top_languages(repos: list[dict]) -> list[LanguageStat]:
    lang_counts: dict[str, int] = {}

    for repo in repos:
        lang = repo.get("language")
        if lang:
            lang_counts[lang] = lang_counts.get(lang, 0) + 1

    total = sum(lang_counts.values())
    if not total:
        return []

    return [
        LanguageStat(
            name=name,
            percentage=round((count / total) * 100),
            color=LANG_COLORS.get(name, "#8b949e"),
        )
        for name, count in sorted(lang_counts.items(), key=lambda x: -x[1])[:6]
    ]


def get_top_repos(repos: list[dict], commit_counts: dict[str, int]) -> list[RepoSummary]:
    sorted_repos = sorted(
        repos,
        key=lambda r: (commit_counts.get(r["name"], 0), r["stargazers_count"]),
        reverse=True,
    )

    return [
        RepoSummary(
            name=r["name"],
            description=r.get("description"),
            language=r.get("language"),
            stars=r["stargazers_count"],
            forks=r["forks_count"],
            commits=commit_counts.get(r["name"], 0),
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


def get_checklist(user: dict) -> list[HealthCheck]:
    return [
        HealthCheck(label="Profile photo",  passed="identicon" not in user.get("avatar_url", "")),
        HealthCheck(label="Bio written",    passed=bool(user.get("bio"))),
        HealthCheck(label="Location set",   passed=bool(user.get("location"))),
        HealthCheck(label="Website / blog", passed=bool(user.get("blog"))),
        HealthCheck(label="10+ followers",  passed=user.get("followers", 0) >= 10),
        HealthCheck(label="1+ year old",    passed=(
            datetime.now(timezone.utc) - datetime.fromisoformat(
                user["created_at"].replace("Z", "+00:00")
            )
        ).days / 365 >= 1),
    ]