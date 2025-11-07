
import React from 'react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="relative">
        <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-auto object-cover rounded-lg aspect-video group-hover:rounded-none transition-all duration-200"
        />
      </div>
      <div className="flex items-start mt-3">
        {/* Placeholder for channel avatar */}
        <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 mr-3"></div>
        <div className="flex-grow">
          <h3 className="text-md font-medium text-white line-clamp-2 leading-snug">
            {video.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-1">{video.channelName}</p>
          <div className="text-sm text-zinc-400 flex items-center">
            <span>{video.views}</span>
            <span className="mx-1.5">•</span>
            <span>{video.uploadDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
