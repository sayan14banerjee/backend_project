import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import { BookmarkSquare, Plus, Loader, Trash2 } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const Playlists = () => {
  const { addToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const { data: playlists, mutate } = useSWR(
    '/playlists/my-playlists',
    fetcher
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter a playlist name', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/playlists', formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      mutate();
      addToast('Playlist created!', 'success');
    } catch (error) {
      addToast('Failed to create playlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Delete this playlist?')) {
      setDeleting(playlistId);
      try {
        await api.delete(`/playlists/${playlistId}`);
        mutate();
        addToast('Playlist deleted', 'success');
      } catch (error) {
        addToast('Failed to delete playlist', 'error');
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BookmarkSquare size={32} />
            Playlists
          </h1>
          <p className="text-muted-foreground">Organize your favorite videos</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-semibold"
        >
          <Plus size={18} />
          New Playlist
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-card rounded-lg border border-muted p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Create Playlist</h2>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Playlist name"
                className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                rows="3"
                className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlists Grid */}
      {playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="group bg-card rounded-lg border border-muted overflow-hidden hover:border-accent transition"
            >
              <div className="relative bg-secondary aspect-video flex items-center justify-center">
                {playlist.videos && playlist.videos[0] && (
                  <img
                    src={playlist.videos[0].thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                  <BookmarkSquare className="text-white opacity-0 group-hover:opacity-100 transition" size={40} />
                </div>
                {playlist.videos && (
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold">
                    {playlist.videos.length} videos
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-foreground group-hover:text-accent transition line-clamp-2">
                  {playlist.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {playlist.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No playlists yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-semibold"
          >
            <Plus size={18} />
            Create your first playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default Playlists;
