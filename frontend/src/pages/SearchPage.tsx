import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import type { Movie } from '../types';
import MovieCard from '../components/MovieCard';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/movies/search?query=${encodeURIComponent(query)}`);
        
        console.log("Результаты поиска:", response.data);
        
        if (response.data && response.data.docs) {
          setMovies(response.data.docs);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Ошибка поиска:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <div className="text-center mt-20 text-gray-400">Ищем фильмы...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Результаты поиска: <span className="text-blue-500">"{query}"</span>
      </h1>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id}
              id={movie.id}
              title={movie.name}
              posterPath={movie.poster?.url || ''}
              rating={movie.rating?.kp || 0}       
              year={movie.year}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">Ничего не найдено по вашему запросу.</p>
          <p className="text-gray-600 mt-2 text-sm">Попробуйте изменить название или проверить раскладку.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;