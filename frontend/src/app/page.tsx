'use client'

import { useEffect, useState } from 'react'
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
  try {
    const response = await api.get(url)
    return response.data.data
  } catch (error) {
    throw error
  }
}

export default function Home() {
  const { data: videos, isLoading, error } = useSWR<Video[]>('/videos', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to VideoHub</h1>
        <p className="text-muted-foreground">Discover amazing videos from creators around the world</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Failed to load videos. Please try again later.
        </div>
      )}

      {/* Videos grid */}
      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos found. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
