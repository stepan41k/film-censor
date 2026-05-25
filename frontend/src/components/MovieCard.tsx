import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

interface MovieCardProps {
  id: number;
  title: string;    
  posterPath: string;
  rating: number;     
  year: number;    
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, posterPath, rating, year }) => {
  return (
      <Link to={`/movie/${id}`} className="block w-full"> {/* Карточка занимает 100% от колонки сетки */}
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              <div className="relative aspect-2/3">
                <img 
                  src={posterPath} 
                  className="w-full h-full object-cover"
                />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-bold">
              {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col grow">
          <h3 className="text-white font-bold text-base leading-tight mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <div className="mt-auto flex items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{year}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;