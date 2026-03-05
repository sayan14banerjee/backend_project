import React, { useState } from 'react';
import useSWR from 'swr';
import api from '../lib/api';
import VideoCard from '../components/VideoCard';
import { Flame, Loader } from 'lucide-react';

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data.data;
};

const Trending = () => {
  const [page, setPage] = useState(1);
  const { data: videos, error, isLoading } = useSWR(
    `/videos?page=${page}&limit=12&sortBy=views&sortType=desc`,
    fetcher
  );

  const videosList = videos?.videos || [];
  const totalPages = videos?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-secondary to-card p-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-2 flex items-center gap-2">
            <Flame size={32} />
            Trending Now
          </h1>
          <p className="text-muted-foreground text-lg">
            The most watched videos right now
          </p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
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

        {videosList && videosList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {videosList.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition"
                >
                  Previous
                </button>

                <span className="text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No videos available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
