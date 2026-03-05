import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import { useToast } from '../context/ToastContext';
import VideoCard from '../components/VideoCard';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Loader } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const Video = () => {
  const { videoId } = useParams();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const { data: video, error: videoError, isLoading: videoLoading, mutate: mutateVideo } = useSWR(
    videoId ? `/videos/${videoId}` : null,
    fetcher
  );

  const { data: comments, mutate: mutateComments } = useSWR(
    videoId ? `/comments/${videoId}` : null,
    fetcher
  );

  const { data: relatedVideos } = useSWR(
    `/videos?limit=8&sortBy=views&sortType=desc`,
    fetcher
  );

  const handleLike = async () => {
    if (!user) {
      addToast('Please login to like videos', 'info');
      return;
    }

    try {
      await api.post(`/likes/toggle/v/${videoId}`);
      mutateVideo();
      addToast('Liked!', 'success');
    } catch (error) {
      addToast('Failed to like video', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!user) {
      addToast('Please login to comment', 'info');
      return;
    }

    setCommentLoading(true);
    try {
      await api.post(`/comments/${videoId}`, { content: comment });
      setComment('');
      mutateComments();
      addToast('Comment added!', 'success');
    } catch (error) {
      addToast('Failed to add comment', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  if (videoLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  if (videoError || !video) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          Error loading video. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="relative w-full bg-secondary rounded-lg overflow-hidden mb-6">
            <video
              src={video.videoFile}
              controls
              autoPlay
              className="w-full aspect-video"
            />
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-3">{video.title}</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Creator Info */}
              <Link
                to={`/channel/${video.owner._id}`}
                className="flex items-center gap-3 hover:bg-secondary p-2 rounded-lg transition"
              >
                {video.owner.avatar && (
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-foreground">{video.owner.username}</p>
                  <p className="text-sm text-muted-foreground">{video.owner.subscribersCount} subscribers</p>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent/20 text-foreground rounded-full transition"
                >
                  <ThumbsUp size={18} />
                  <span>{video.likesCount || 0}</span>
                </button>

                <button className="p-2 bg-secondary hover:bg-accent/20 text-foreground rounded-full transition">
                  <Share2 size={18} />
                </button>

                <button className="p-2 bg-secondary hover:bg-accent/20 text-foreground rounded-full transition">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Video Stats & Description */}
            <div className="bg-secondary p-4 rounded-lg mb-6">
              <p className="text-muted-foreground mb-2">
                {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <p className="text-foreground whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-muted pt-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare size={24} />
              Comments
            </h2>

            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-4">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows="3"
                      className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                    <button
                      type="submit"
                      disabled={commentLoading || !comment.trim()}
                      className="mt-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentLoading ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-secondary p-4 rounded-lg mb-6 text-center">
                <p className="text-muted-foreground">
                  <Link to="/login" className="text-accent hover:text-accent-foreground font-semibold">
                    Sign in
                  </Link>
                  {' '}to comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-4">
                    {c.owner.avatar && (
                      <img
                        src={c.owner.avatar}
                        alt={c.owner.username}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/channel/${c.owner._id}`}
                          className="font-semibold text-foreground hover:text-accent transition"
                        >
                          {c.owner.username}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground mt-1">{c.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Related Videos</h3>
          <div className="space-y-4">
            {relatedVideos?.videos?.slice(0, 6).map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
