import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import { Movie, Review } from '../types';

const TMDB_KEY = 'YOUR_TMDB_API_KEY';
const BACKEND_URL = 'http://localhost:8000';

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null); // Может быть фильмом или null
  const [reviews, setReviews] = useState<Review[]>([]);

  // Загрузка данных о фильме
  const fetchMovieDetails = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=ru-RU`
    );
    setMovie(res.data);
  };

  // Загрузка отзывов из FastAPI
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Ошибка загрузки отзывов", err);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id]);

  if (!movie) return <div className="text-center mt-20">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Секция с инфо о фильме */}
      <div className="flex flex-col md:flex-row gap-10 mb-12">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title}
          className="w-full md:w-80 rounded-2xl shadow-2xl border border-gray-800"
        />
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold mb-4">{movie.title}</h1>
          <p className="text-gray-400 text-lg mb-6 italic">{movie.tagline}</p>
          <div className="bg-gray-900 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-2">О фильме</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full border border-blue-500/30 font-bold">
              Рейтинг TMDB: {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Секция отзывов */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Отзывы зрителей ({reviews.length})</h2>
          {reviews.length > 0 ? (
              reviews.map((rev: Review) => ( // Заменяем any на Review
                  <ReviewCard 
                    key={rev.id} 
                    username={rev.username} 
                    rating={rev.rating} 
                    comment={rev.comment} 
                  />
            ))
          ) : (
            <p className="text-gray-500 bg-gray-900/50 p-6 rounded-xl border border-dashed border-gray-700">
              Пока отзывов нет. Станьте первым!
            </p>
          )}
        </div>
        
        <div>
          <div className="sticky top-24">
            <ReviewForm movieId={Number(id)} onReviewSubmit={fetchReviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;