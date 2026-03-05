'use client'

import { useAuth } from '@/store/authStore'
import useSWR from 'swr'
import api from '@/lib/api'
import VideoCard from '@/components/VideoCard'
import { Loader2 } from 'lucide-react'

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

const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data.data
}

export default function WatchLaterPage() {
  const { isAuthenticated, user } = useAuth()

  const { data: videos = [], isLoading } = useSWR<Video[]>(
    isAuthenticated ? `/users/watch-history` : null,
    fetcher
  )

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view watch history</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Watch History</h1>
        <p className="text-muted-foreground">Videos you've watched</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Videos grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No watch history yet</p>
        </div>
      )}
    </div>
  )
}
