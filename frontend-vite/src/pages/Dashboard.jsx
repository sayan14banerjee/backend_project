import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import { useToast } from '../context/ToastContext';
import { BarChart3, Eye, ThumbsUp, MessageSquare, Settings, Loader, Trash2, Edit } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [deleting, setDeleting] = useState(null);

  const { data: userVideos, mutate } = useSWR(
    '/videos/my-videos',
    fetcher
  );

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setDeleting(videoId);
      try {
        await api.delete(`/videos/${videoId}`);
        mutate();
        addToast('Video deleted successfully', 'success');
      } catch (error) {
        addToast('Failed to delete video', 'error');
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BarChart3 size={32} />
          Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your channel and videos</p>
      </div>

      {/* Stats */}
      {userVideos && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-muted rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Eye className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Views</p>
                <p className="text-2xl font-bold text-foreground">
                  {userVideos.totalViews || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-muted rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <ThumbsUp className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-foreground">
                  {userVideos.totalLikes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-muted rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Comments</p>
                <p className="text-2xl font-bold text-foreground">
                  {userVideos.totalComments || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Table */}
      <div className="bg-card border border-muted rounded-lg overflow-hidden">
        <div className="p-6 border-b border-muted flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Your Videos</h2>
          <Link
            to="/upload"
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-semibold"
          >
            Upload New
          </Link>
        </div>

        {userVideos && userVideos.videos && userVideos.videos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Video</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Views</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Likes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Comments</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userVideos.videos.map((video) => (
                  <tr key={video._id} className="border-b border-muted hover:bg-secondary/50 transition">
                    <td className="px-6 py-4">
                      <Link
                        to={`/video/${video._id}`}
                        className="flex items-center gap-3 hover:text-accent transition"
                      >
                        {video.thumbnail && (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-foreground line-clamp-2">{video.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-foreground">{video.views}</td>
                    <td className="px-6 py-4 text-foreground">{video.likesCount || 0}</td>
                    <td className="px-6 py-4 text-foreground">{video.commentsCount || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        video.isPublished
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-yellow-900/30 text-yellow-300'
                      }`}>
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-secondary rounded-lg transition text-foreground"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video._id)}
                          disabled={deleting === video._id}
                          className="p-2 hover:bg-destructive/20 rounded-lg transition text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          {deleting === video._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No videos uploaded yet</p>
            <Link
              to="/upload"
              className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-semibold"
            >
              Upload Your First Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
