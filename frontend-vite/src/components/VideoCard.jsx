import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';

const formatViews = (views) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views;
};

const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return d.toLocaleDateString();
};

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="group cursor-pointer">
      <div className="relative rounded-lg overflow-hidden bg-secondary aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition" fill="white" />
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        {video.owner?.avatar && (
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground line-clamp-2 text-sm group-hover:text-accent transition">
            {video.title}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            {video.owner?.username || 'Unknown'}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {formatViews(video.views)} views
            </span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
