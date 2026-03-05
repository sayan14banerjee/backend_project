'use client'

import { useAuth } from '@/store/authStore'
import useSWR from 'swr'
import api from '@/lib/api'
import { BarChart3, Eye, Heart, MessageSquare, Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Video {
  _id: string
  title: string
  views: number
  thumbnail: string
  isPublished: boolean
  createdAt: string
}

const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data.data
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])

  const { data: videos = [], mutate } = useSWR<Video[]>(
    isAuthenticated ? '/videos/my-videos' : null,
    fetcher
  )

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view your dashboard</p>
      </div>
    )
  }

  const totalViews = videos.reduce((acc, video) => acc + video.views, 0)
  const publishedCount = videos.filter(v => v.isPublished).length

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      await api.delete(`/videos/${videoId}`)
      mutate()
      toast.success('Video deleted successfully')
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const handleTogglePublish = async (videoId: string) => {
    try {
      await api.patch(`/videos/toggle-publish/${videoId}`)
      mutate()
      toast.success('Video status updated')
    } catch (error) {
      toast.error('Failed to update video')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">Manage and analyze your videos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Views</p>
              <p className="text-3xl font-bold text-accent">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-10 h-10 text-accent opacity-50" />
          </div>
        </div>

        <div className="bg-muted rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Published Videos</p>
              <p className="text-3xl font-bold text-foreground">{publishedCount}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
        </div>

        <div className="bg-muted rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Videos</p>
              <p className="text-3xl font-bold text-foreground">{videos.length}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Your Videos</h2>

        {videos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Video</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Views</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Uploaded</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{video.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{video.views.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          video.isPublished
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        {video.isPublished ? 'Published' : 'Unlisted'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(video._id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Toggle publish"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="p-2 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete video"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No videos uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
