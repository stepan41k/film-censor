import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  releaseDate: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, posterPath, rating, releaseDate }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

  return (
    <Link to={`/movie/${id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-105">
        <img 
          src={posterPath ? imageUrl : 'https://via.placeholder.com/500x750?text=No+Poster'} 
          alt={title} 
          className="w-full h-96 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white font-bold text-lg truncate">{title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400 text-sm">{releaseDate.split('-')[0]}</span>
            <div className="flex items-center text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;