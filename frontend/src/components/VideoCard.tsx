'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye, Clock } from 'lucide-react'

interface Video {
  _id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  views: number
  owner: {
    _id: string
    username: string
    fullName: string
    avatar: string
  }
  createdAt: string
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function formatViews(views: number) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video._id}`}>
      <div className="group cursor-pointer">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden mb-3">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Video info */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm">
            {video.title}
          </h3>

          {/* Channel info */}
          <Link
            href={`/channel/${video.owner._id}`}
            className="flex items-center gap-2 group/channel"
            onClick={(e) => e.preventDefault()}
          >
            <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
              <img
                src={video.owner.avatar}
                alt={video.owner.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground group-hover/channel:text-accent transition-colors truncate">
                {video.owner.fullName}
              </p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(video.views)} views
            </span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
