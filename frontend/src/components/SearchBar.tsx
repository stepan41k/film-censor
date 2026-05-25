import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск фильмов..."
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all"
      />
      <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
    </form>
  );
};

export default SearchBar;