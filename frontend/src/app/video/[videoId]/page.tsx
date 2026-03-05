'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/store/authStore'
import { Heart, MessageCircle, Share2, MoreVertical, Play, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import VideoCard from '@/components/VideoCard'

interface Video {
  _id: string
  title: string
  description: string
  videoFile: string
  thumbnail: string
  duration: number
  views: number
  isPublished: boolean
  owner: {
    _id: string
    username: string
    fullName: string
    avatar: string
  }
  createdAt: string
}

interface Comment {
  _id: string
  content: string
  owner: {
    _id: string
    username: string
    fullName: string
    avatar: string
  }
  createdAt: string
  likesCount: number
}

const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data.data
}

export default function VideoPage() {
  const params = useParams()
  const videoId = params.videoId as string
  const { user, isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const { data: video, isLoading: videoLoading } = useSWR<Video>(
    videoId ? `/videos/get-video/${videoId}` : null,
    fetcher
  )
  const { data: comments = [] } = useSWR<Comment[]>(
    videoId ? `/comments/${videoId}` : null,
    fetcher
  )

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos')
      return
    }
    try {
      setIsLiked(!isLiked)
      await api.post(`/likes/toggle/v/${videoId}`)
      toast.success(isLiked ? 'Removed from liked videos' : 'Added to liked videos')
    } catch (error) {
      setIsLiked(!isLiked)
      toast.error('Failed to like video')
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      return
    }
    try {
      setIsSubscribed(!isSubscribed)
      await api.post(`/subscriptions/c/${video?.owner._id}`)
      toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed')
    } catch (error) {
      setIsSubscribed(!isSubscribed)
      toast.error('Failed to update subscription')
    }
  }

  if (videoLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Video not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="w-full bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full"
          poster={video.thumbnail}
        />
      </div>

      {/* Video Title and Stats */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{video.title}</h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: Channel info */}
          <Link
            href={`/channel/${video.owner._id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
              <img
                src={video.owner.avatar}
                alt={video.owner.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">{video.owner.fullName}</p>
              <p className="text-sm text-muted-foreground">@{video.owner.username}</p>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-accent/20 text-accent'
                  : 'bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline text-sm font-medium">Like</span>
            </button>

            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                isSubscribed
                  ? 'bg-muted text-foreground'
                  : 'bg-accent text-background hover:bg-accent-hover'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>

            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>

            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-muted rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2">
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>
        <p className="text-foreground whitespace-pre-wrap">{video.description}</p>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          {comments.length} Comments
        </h2>

        {/* Comment input */}
        {isAuthenticated ? (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
              <img
                src={user?.avatar}
                alt={user?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            <Link href="/auth/login" className="text-accent hover:text-accent-hover">
              Sign in
            </Link>{' '}
            to comment
          </p>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                <img
                  src={comment.owner.avatar}
                  alt={comment.owner.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">
                    {comment.owner.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{comment.owner.username}
                  </span>
                </div>
                <p className="text-foreground text-sm mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    Like
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
