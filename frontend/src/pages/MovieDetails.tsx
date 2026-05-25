import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Movie, Review } from '../types';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import { Star, Calendar, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Ошибка загрузки отзывов:", err);
    }
  }, [id]);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/movies/${id}`);
        setMovie(res.data);
        await fetchReviews();
      } catch (err) {
        console.error("Ошибка загрузки данных фильма:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, fetchReviews]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-400">Загрузка информации...</p>
    </div>
  );

  if (!movie) return <div className="text-center mt-20">Фильм не найден</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={20} />
        Назад к списку
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <img 
              src={movie.poster?.url} 
              alt={movie.name} 
              className="w-full rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800"
            />
            
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                <span className="text-xl font-bold">{movie.rating.kp.toFixed(1)}</span>
                <span className="text-gray-500 text-xs">Кинопоиск</span>
              </div>
              <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300">
                <Calendar size={18} />
                <span>{movie.year}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-5xl font-black mb-4 leading-tight">{movie.name}</h1>
          
          <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl mb-12">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Описание фильма</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description || "Описание для этого фильма временно отсутствует."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-6">Отзывы зрителей ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <ReviewCard 
                      key={rev.id}
                      username={rev.username}
                      rating={rev.rating}
                      comment={rev.comment}
                    />
                  ))
                ) : (
                  <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl p-8 text-center text-gray-500">
                    Здесь пока нет отзывов. Станьте первым!
                  </div>
                )}
              </div>
            </div>

            <div className="sticky top-28 h-fit">
              <ReviewForm movieId={Number(id)} onReviewSubmit={fetchReviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;