import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import { useToast } from '../context/ToastContext';
import VideoCard from '../components/VideoCard';
import { UserPlus, Loader } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const Channel = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const { data: channel, error, isLoading, mutate } = useSWR(
    userId ? `/users/c/${userId}` : null,
    fetcher
  );

  const { data: videos } = useSWR(
    userId ? `/videos?userId=${userId}` : null,
    fetcher
  );

  const handleSubscribe = async () => {
    if (!user) {
      addToast('Please login to subscribe', 'info');
      return;
    }

    try {
      await api.post(`/subscriptions/c/${userId}`);
      mutate();
      addToast('Subscribed!', 'success');
    } catch (error) {
      addToast('Failed to subscribe', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          Channel not found.
        </div>
      </div>
    );
  }

  const isOwnChannel = user?._id === userId;
  const isSubscribed = channel.isSubscribed;

  return (
    <div className="min-h-screen bg-background">
      {/* Channel Header */}
      <div className="bg-gradient-to-r from-secondary to-card px-4 py-12">
        <div className="max-w-6xl mx-auto flex items-start gap-8">
          {channel.avatar && (
            <img
              src={channel.avatar}
              alt={channel.username}
              className="w-32 h-32 rounded-full object-cover flex-shrink-0"
            />
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {channel.username}
            </h1>
            <p className="text-muted-foreground mb-4">
              {channel.subscribersCount} subscribers • {videos?.videos?.length || 0} videos
            </p>
            <p className="text-foreground mb-6">{channel.description}</p>

            {!isOwnChannel && (
              <button
                onClick={handleSubscribe}
                className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition font-semibold"
              >
                <UserPlus size={18} />
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Videos</h2>

        {videos?.videos && videos.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No videos uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
