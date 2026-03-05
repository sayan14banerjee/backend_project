'use client'

import { useAuth } from '@/store/authStore'
import useSWR from 'swr'
import api from '@/lib/api'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Playlist {
  _id: string
  name: string
  description?: string
  videos: any[]
  owner: {
    _id: string
    username: string
  }
  createdAt: string
}

const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data.data
}

export default function PlaylistsPage() {
  const { isAuthenticated, user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [playlistName, setPlaylistName] = useState('')

  const { data: playlists = [], isLoading, mutate } = useSWR<Playlist[]>(
    isAuthenticated ? `/playlists/user/${user?._id}` : null,
    fetcher
  )

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playlistName.trim()) {
      toast.error('Playlist name is required')
      return
    }

    try {
      await api.post('/playlists', { name: playlistName })
      setPlaylistName('')
      setShowCreateForm(false)
      mutate()
      toast.success('Playlist created')
    } catch (error) {
      toast.error('Failed to create playlist')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view playlists</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Playlists</h1>
          <p className="text-muted-foreground">Organize your videos</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg font-semibold hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Playlist
        </button>
      </div>

      {/* Create playlist form */}
      {showCreateForm && (
        <form onSubmit={handleCreatePlaylist} className="bg-muted rounded-lg p-4 border border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="flex-1 px-4 py-2 bg-background text-foreground rounded border border-border focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-background rounded font-semibold hover:bg-accent-hover transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Playlists grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              href={`/playlist/${playlist._id}`}
              className="group bg-muted rounded-lg overflow-hidden border border-border hover:border-accent transition-colors"
            >
              {/* Playlist thumbnail */}
              <div className="relative w-full aspect-video bg-background flex items-center justify-center group-hover:bg-muted/50 transition-colors">
                {playlist.videos.length > 0 ? (
                  <img
                    src={playlist.videos[0].thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-accent" />
                  </div>
                )}
                {/* Video count badge */}
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                  {playlist.videos.length} videos
                </div>
              </div>

              {/* Playlist info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                  {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {playlist.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No playlists yet. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
