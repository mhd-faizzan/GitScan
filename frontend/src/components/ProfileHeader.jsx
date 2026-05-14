import { AdvancedImage } from '@cloudinary/react'
import { CloudinaryImage } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { auto } from '@cloudinary/url-gen/qualifiers/format'
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality'

export default function ProfileHeader({ report }) {
  // fetch github avatar through cloudinary for smart crop and optimization
  const avatarImage = new CloudinaryImage('', { cloudName: 'dhdsuetod' })
    .setDeliveryType('fetch')
    .resize(fill().width(80).height(80).gravity(autoGravity()))
    .delivery(format(auto()))
    .delivery(quality(autoQuality()))

  avatarImage.setPublicID(report.avatar_url)

  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-7 flex gap-7 items-start mb-5">
      <AdvancedImage
        cldImg={avatarImage}
        alt="avatar"
        className="w-20 h-20 rounded-full border-2 border-zinc-800 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <span className="inline-block font-mono text-[10px] text-green-400 border border-green-500/30 bg-green-500/10 rounded px-2.5 py-1 tracking-widest uppercase mb-3">
          {report.dev_type}
        </span>
        <h2 className="text-xl font-semibold mb-1">{report.name ?? report.username}</h2>
        <p className="font-mono text-sm text-blue-400 mb-2">@{report.username}</p>
        {report.bio && <p className="text-zinc-400 text-sm leading-relaxed mb-3">{report.bio}</p>}
        <div className="flex flex-wrap gap-5 text-sm text-zinc-500">
          {report.location && <span>📍 {report.location}</span>}
          <span><strong className="text-white">{report.public_repos}</strong> repos</span>
          <span><strong className="text-white">{report.followers}</strong> followers</span>
          <span><strong className="text-white">{report.following}</strong> following</span>
          <span>Joined <strong className="text-white">{report.joined_year}</strong></span>
        </div>
      </div>
    </div>
  )
}