import ProfileHeader from './ProfileHeader'
import ScoreCards from './ScoreCards'
import HireScore from './HireScore'
import TechStack from './TechStack'
import TopRepos from './TopRepos'
import Checklist from './Checklist'

export default function ProfileReport({ report }) {
  return (
    <div>
      <ProfileHeader report={report} />
      <ScoreCards scores={report.scores} />
      <HireScore score={report.scores.hire} />
      <TechStack languages={report.languages} />
      <TopRepos repos={report.top_repos} />
      <Checklist checklist={report.checklist} />
    </div>
  )
}