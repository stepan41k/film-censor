import React, { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

interface ReviewFormProps {
  movieId: number;
  onReviewSubmit: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewSubmit }) => {
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !comment) return alert('Заполните все поля');

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8000/reviews/', {
        movie_id: movieId,
        username,
        rating,
        comment
      });
      // Сброс формы
      setUsername('');
      setComment('');
      setRating(10);
      onReviewSubmit(); // Вызываем колбэк для обновления списка
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      alert('Не удалось отправить отзыв');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Оставить отзыв</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Ваше имя</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Никнейм"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Оценка (1-10)</label>
          <input 
            type="number" 
            min="1" max="10" 
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Текст отзыва</label>
        <textarea 
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Что вы думаете о фильме?"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        {isSubmitting ? 'Отправка...' : <><Send size={18} /> Отправить отзыв</>}
      </button>
    </form>
  );
};

export default ReviewForm;