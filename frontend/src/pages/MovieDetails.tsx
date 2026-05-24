import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Movie, Review } from '../types';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';

const BACKEND_URL = 'http://localhost:8000';

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Эту функцию оставляем через useCallback, так как она нужна 
  // и в useEffect, и в ReviewForm (для обновления списка)
  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Ошибка загрузки отзывов", err);
    }
  }, [id]);

  useEffect(() => {
      let isMounted = true;
  
      // Оборачиваем всю логику в одну асинхронную функцию
      const loadAllData = async () => {
        try {
          // Загружаем данные о фильме
          const res = await axios.get(`http://localhost:8000/movies/${id}`);
          
          // Загружаем отзывы (вызываем функцию, которая определена через useCallback выше)
          // Но делаем это только если компонент еще на экране
          if (isMounted) {
            setMovie(res.data);
            await fetchReviews(); 
          }
        } catch (err) {
          console.error("Ошибка при загрузке:", err);
        }
      };
  
      // Запускаем загрузку
      void loadAllData();
  
      return () => {
        isMounted = false;
      };
    }, [id, fetchReviews]);

  if (!movie) return <div className="text-center mt-20">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ... твой остальной JSX код (шапка фильма, постер и т.д.) ... */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Отзывы ({reviews.length})</h2>
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} {...rev} />
          ))}
        </div>
        
        <div>
           {/* Передаем функцию обновления в форму */}
          <ReviewForm movieId={Number(id)} onReviewSubmit={fetchReviews} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;