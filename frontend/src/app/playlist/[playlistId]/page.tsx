'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import api from '@/lib/api'
import { Loader2, Trash2, Plus } from 'lucide-react'
import VideoCard from '@/components/VideoCard'
import toast from 'react-hot-toast'

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

interface Playlist {
  _id: string
  name: string
  description?: string
  videos: Video[]
  owner: {
    _id: string
    username: string
    fullName: string
  }
  createdAt: string
}

const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data.data
}

export default function PlaylistPage() {
  const params = useParams()
  const playlistId = params.playlistId as string

  const { data: playlist, isLoading, mutate } = useSWR<Playlist>(
    playlistId ? `/playlists/${playlistId}` : null,
    fetcher
  )

  const handleRemoveVideo = async (videoId: string) => {
    if (!confirm('Remove this video from playlist?')) return

    try {
      await api.patch(`/playlists/remove/${videoId}/${playlistId}`)
      mutate()
      toast.success('Video removed from playlist')
    } catch (error) {
      toast.error('Failed to remove video')
    }
  }

  const handleDeletePlaylist = async () => {
    if (!confirm('Delete this playlist? This cannot be undone.')) return

    try {
      await api.delete(`/playlists/${playlistId}`)
      toast.success('Playlist deleted')
      // Redirect to playlists page
      window.location.href = '/playlists'
    } catch (error) {
      toast.error('Failed to delete playlist')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Playlist not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Playlist header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">{playlist.name}</h1>
            <p className="text-muted-foreground mb-2">{playlist.videos.length} videos</p>
            {playlist.description && (
              <p className="text-foreground">{playlist.description}</p>
            )}
          </div>
          <button
            onClick={handleDeletePlaylist}
            className="p-2 hover:bg-red-500/10 rounded transition-colors"
            title="Delete playlist"
          >
            <Trash2 className="w-6 h-6 text-red-400" />
          </button>
        </div>
      </div>

      {/* Videos */}
      {playlist.videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlist.videos.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} />
              <button
                onClick={() => handleRemoveVideo(video._id)}
                className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from playlist"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos in this playlist</p>
        </div>
      )}
    </div>
  )
}
