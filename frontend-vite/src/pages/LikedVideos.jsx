import React from 'react';
import useSWR from 'swr';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';
import { ThumbsUp, Loader } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const LikedVideos = () => {
  const { data: videos, error, isLoading } = useSWR(
    '/likes/videos',
    fetcher
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
        <ThumbsUp size={32} />
        Liked Videos
      </h1>
      <p className="text-muted-foreground mb-8">Videos you've liked</p>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          Error loading videos. Please try again later.
        </div>
      )}

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No liked videos yet</p>
          <p className="text-muted-foreground">Videos you like will appear here</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
