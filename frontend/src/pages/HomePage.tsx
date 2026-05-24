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
          setMovies(response.data.results);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie: Movie) => ( // Заменяем any на Movie
            <MovieCard 
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              releaseDate={movie.release_date}
            />
          ))}
      </div>
    </div>
  );
};

export default HomePage;