import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types';

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
          const response = await axios.get(`http://localhost:8000/movies/popular`);
          setMovies(response.data.docs);
      } catch (error) {
        console.error("Ошибка при загрузке фильмов", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl">Загрузка фильмов...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Популярные фильмы</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
        {movies.map((movie: Movie) => (
          <div key={movie.id} className="w-full max-w-[220px]">
            <MovieCard 
              id={movie.id}
              title={movie.name}
              posterPath={movie.poster.url}
              rating={movie.rating.kp}
              year={movie.year}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;