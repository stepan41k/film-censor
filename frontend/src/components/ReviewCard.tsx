import React from 'react';
import { User, Star } from 'lucide-react';

interface ReviewCardProps {
  username: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ username, rating, comment, createdAt }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-full">
            <User size={18} className="text-white" />
          </div>
          <span className="font-medium text-gray-200">{username}</span>
        </div>
        <div className="flex items-center bg-yellow-900/30 px-2 py-1 rounded">
          <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-yellow-500 font-bold text-sm">{rating}/10</span>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed italic text-sm">
        "{comment}"
      </p>
      {createdAt && (
        <span className="text-xs text-gray-500 mt-3 block">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

export default ReviewCard;