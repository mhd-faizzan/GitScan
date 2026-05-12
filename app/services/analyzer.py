from datetime import datetime, timezone
from app.models.profile import Scores, LanguageStat, HealthCheck, RepoSummary

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


def calc_activity_score(events: list[dict]) -> int:
    push_events = [e for e in events if e["type"] == "PushEvent"]
    commit_count = sum(len(e.get("payload", {}).get("commits", [])) for e in push_events)

    now = datetime.now(timezone.utc)
    has_recent = any(
        (now - datetime.fromisoformat(e["created_at"].replace("Z", "+00:00"))).days <= 30
        for e in events
    )

    score = min(100, round((commit_count / 80) * 100))
    if has_recent:
        score = min(100, score + 10)

    return score


def calc_quality_score(repos: list[dict]) -> int:
    if not repos:
        return 0

    with_desc = sum(1 for r in repos if (r.get("description") or "").strip())
    desc_ratio = with_desc / len(repos)

    avg_stars = sum(r["stargazers_count"] for r in repos) / len(repos)
    # 5 avg stars = full score
    star_score = min(1.0, avg_stars / 5)

    return round((desc_ratio * 0.5 + star_score * 0.5) * 100)


def calc_consistency_score(repos: list[dict]) -> int:
    if not repos:
        return 0

    now = datetime.now(timezone.utc)
    active_months = set()

    for repo in repos:
        updated = datetime.fromisoformat(repo["updated_at"].replace("Z", "+00:00"))
        months_ago = (now - updated).days // 30
        if months_ago <= 12:
            active_months.add(months_ago)

    return round((len(active_months) / 12) * 100)


def calc_health_score(user: dict) -> int:
    checks = [
        "identicon" not in user.get("avatar_url", ""),
        bool(user.get("bio")),
        bool(user.get("location")),
        bool(user.get("blog")),
        user.get("followers", 0) >= 10,
        (datetime.now(timezone.utc) - datetime.fromisoformat(
            user["created_at"].replace("Z", "+00:00")
        )).days / 365 >= 1,
    ]

    points_each = 100 // len(checks)
    return min(100, sum(checks) * points_each)


def calc_hire_score(scores: dict) -> int:
    return round(
        scores["activity"]    * 0.30 +
        scores["quality"]     * 0.30 +
        scores["consistency"] * 0.20 +
        scores["health"]      * 0.20
    )


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

    if pct("Python") > 40:       return "ML / AI Engineer"
    if js_ts > 50:                return "Frontend Developer"
    if pct("Python") > 20 and js_ts > 20: return "Full Stack Developer"
    if pct("Java") > 30 or pct("Go") > 30 or pct("Rust") > 30: return "Backend Engineer"
    if pct("HTML") + pct("CSS") > 40: return "Web Designer"

    return "Polyglot Developer"


def get_top_languages(repos: list[dict]) -> list[LanguageStat]:
    lang_counts: dict[str, int] = {}

    for repo in repos:
        lang = repo.get("language")
        if lang:
            lang_counts[lang] = lang_counts.get(lang, 0) + 1

    total = sum(lang_counts.values())

    return [
        LanguageStat(
            name=name,
            percentage=round((count / total) * 100),
            color=LANG_COLORS.get(name, "#8b949e"),
        )
        for name, count in sorted(lang_counts.items(), key=lambda x: -x[1])[:6]
    ]


def get_top_repos(repos: list[dict]) -> list[RepoSummary]:
    sorted_repos = sorted(repos, key=lambda r: r["stargazers_count"], reverse=True)

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


def build_scores(user: dict, repos: list[dict], events: list[dict]) -> Scores:
    scores = {
        "activity":    calc_activity_score(events),
        "quality":     calc_quality_score(repos),
        "consistency": calc_consistency_score(repos),
        "health":      calc_health_score(user),
    }
    scores["hire"] = calc_hire_score(scores)

    return Scores(**scores)