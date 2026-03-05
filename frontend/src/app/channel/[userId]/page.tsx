'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import api from '@/lib/api'
import { useAuth } from '@/store/authStore'
import { Loader2, Users } from 'lucide-react'
import VideoCard from '@/components/VideoCard'
import toast from 'react-hot-toast'

interface ChannelProfile {
  _id: string
  username: string
  fullName: string
  avatar: string
  coverImage?: string
  subscribersCount: number
  channelSubscribedTo: number
}

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

export default function ChannelPage() {
  const params = useParams()
  const userId = params.userId as string
  const { user, isAuthenticated } = useAuth()

  const { data: channel, isLoading: channelLoading } = useSWR<ChannelProfile>(
    userId ? `/users/channel-profile/${userId}` : null,
    fetcher
  )

  const { data: videos = [] } = useSWR<Video[]>(
    userId && isAuthenticated ? `/videos/my-videos` : null,
    fetcher
  )

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      return
    }
    try {
      await api.post(`/subscriptions/c/${userId}`)
      toast.success('Subscription updated')
    } catch (error) {
      toast.error('Failed to update subscription')
    }
  }

  if (channelLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    )
  }

  const isOwnChannel = user?._id === userId

  return (
    <div className="space-y-8">
      {/* Cover image */}
      {channel.coverImage && (
        <div className="w-full h-48 bg-gradient-to-r from-accent to-accent-hover rounded-lg overflow-hidden">
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pb-6 border-b border-border">
        {/* Avatar and info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border-4 border-muted flex-shrink-0">
            <img
              src={channel.avatar}
              alt={channel.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold text-foreground">{channel.fullName}</h1>
            <p className="text-muted-foreground">@{channel.username}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {channel.subscribersCount} subscribers
              </span>
              <span>{channel.channelSubscribedTo} subscriptions</span>
            </div>
          </div>
        </div>

        {/* Subscribe button */}
        {!isOwnChannel && (
          <button
            onClick={handleSubscribe}
            className="px-6 py-2 bg-accent text-background rounded-lg font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        )}
      </div>

      {/* Videos section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Videos</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {isOwnChannel ? 'No videos yet. Start uploading!' : 'No videos from this channel'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
