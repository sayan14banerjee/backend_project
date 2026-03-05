'use client'

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

export default function TrendingPage() {
  const { data: videos = [], isLoading, error } = useSWR<Video[]>(
    '/videos',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const trendingVideos = [...(videos || [])]
    .sort((a, b) => b.views - a.views)
    .slice(0, 20)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Trending</h1>
        <p className="text-muted-foreground">Most viewed videos right now</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Failed to load trending videos. Please try again later.
        </div>
      )}

      {/* Videos grid */}
      {trendingVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trending videos found</p>
        </div>
      )}
    </div>
  )
}
