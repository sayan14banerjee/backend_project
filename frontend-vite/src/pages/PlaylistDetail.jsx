import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import VideoCard from '../components/VideoCard';
import { ArrowLeft, Loader, Trash2 } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const { addToast } = useToast();

  const { data: playlist, error, isLoading, mutate } = useSWR(
    playlistId ? `/playlists/${playlistId}` : null,
    fetcher
  );

  const handleRemoveVideo = async (videoId) => {
    if (window.confirm('Remove this video from playlist?')) {
      try {
        await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
        mutate();
        addToast('Video removed from playlist', 'success');
      } catch (error) {
        addToast('Failed to remove video', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-foreground mb-8"
        >
          <ArrowLeft size={18} />
          Back to playlists
        </Link>
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          Playlist not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        to="/playlists"
        className="inline-flex items-center gap-2 text-accent hover:text-accent-foreground mb-8"
      >
        <ArrowLeft size={18} />
        Back to playlists
      </Link>

      {/* Header */}
      <div className="mb-12">
        {playlist.videos && playlist.videos[0] && (
          <div className="relative w-full bg-secondary rounded-lg overflow-hidden mb-6">
            <img
              src={playlist.videos[0].thumbnail}
              alt={playlist.name}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-sm text-white font-semibold">
              {playlist.videos.length} videos
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-foreground mb-2">{playlist.name}</h1>
        <p className="text-muted-foreground text-lg">{playlist.description}</p>
      </div>

      {/* Videos */}
      {playlist.videos && playlist.videos.length > 0 ? (
        <div className="space-y-4">
          {playlist.videos.map((video) => (
            <div
              key={video._id}
              className="flex gap-4 bg-card rounded-lg border border-muted p-4 hover:border-accent transition"
            >
              <Link
                to={`/video/${video._id}`}
                className="flex-shrink-0 w-40 h-24 bg-secondary rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/video/${video._id}`}
                  className="font-semibold text-foreground hover:text-accent transition line-clamp-2"
                >
                  {video.title}
                </Link>

                <Link
                  to={`/channel/${video.owner._id}`}
                  className="text-sm text-muted-foreground hover:text-accent transition mt-1"
                >
                  {video.owner.username}
                </Link>

                <p className="text-sm text-muted-foreground mt-2">
                  {video.views} views
                </p>
              </div>

              <button
                onClick={() => handleRemoveVideo(video._id)}
                className="p-2 hover:bg-destructive/20 rounded-lg transition text-destructive flex-shrink-0"
                title="Remove from playlist"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No videos in this playlist</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
