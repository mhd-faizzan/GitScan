import ProfileHeader from './ProfileHeader'
import ActivitySummary from './ActivitySummary'
import TechStack from './TechStack'
import TopRepos from './TopRepos'
import Checklist from './Checklist'

export default function ProfileReport({ report }) {
  return (
    <div>
      <ProfileHeader report={report} />
      <ActivitySummary activity={report.activity} />
      <TechStack languages={report.languages} />
      <TopRepos repos={report.top_repos} />
      <Checklist checklist={report.checklist} />
    </div>
  )
}