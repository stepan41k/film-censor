import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Импорт страниц
import HomePage from "./pages/HomePage";
import MovieDetails from "./pages/MovieDetails";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Импорт компонентов
import SearchBar from "./components/SearchBar";
import ProtectedRoute from "./components/ProtectedRoute";

import { Film, LogIn, UserPlus, LogOut, User } from "lucide-react";

function App() {
    const { token, logout } = useContext(AuthContext);

    return (
        <Router>
            <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30">
                {/* НАВИГАЦИЯ */}
                <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-[1600px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Логотип */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-blue-500 hover:scale-105 transition-transform"
                        >
                            <Film size={32} strokeWidth={3} />
                            <span>MOVIERATE</span>
                        </Link>

                        {/* Поиск */}
                        <div className="w-full md:w-auto md:flex-1 md:max-w-md">
                            <SearchBar />
                        </div>

                        {/* Блок авторизации */}
                        <div className="flex items-center gap-3">
                            {token ? (
                                <>
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">
                                        <User size={16} />
                                        <span>Профиль</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold text-sm"
                                    >
                                        <LogOut size={18} />
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-xl transition-all text-sm font-medium"
                                    >
                                        <LogIn size={18} />
                                        Войти
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all text-sm font-bold shadow-lg shadow-blue-900/20"
                                    >
                                        <UserPlus size={18} />
                                        Регистрация
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* КОНТЕНТ СТРАНИЦ */}
                <main className="max-w-[1600px] mx-auto px-4 py-8">
                    <Routes>
                      {/* Теперь главная страница ТОЖЕ защищена */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <HomePage />
                          </ProtectedRoute>
                        } 
                      />
                    
                      {/* Страница деталей фильма */}
                      <Route 
                        path="/movie/:id" 
                        element={
                          <ProtectedRoute>
                            <MovieDetails />
                          </ProtectedRoute>
                        } 
                      />
                    
                      {/* Поиск */}
                      <Route 
                        path="/search" 
                        element={
                          <ProtectedRoute>
                            <SearchPage />
                          </ProtectedRoute>
                        } 
                      />
                    
                      {/* Эти страницы остаются публичными, чтобы юзер мог войти */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </main>

                {/* ФУТЕР */}
                <footer className="border-t border-gray-800 py-12 mt-20">
                    <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <Film size={20} />
                            <span className="font-bold text-gray-400 tracking-widest uppercase">
                                MovieRate
                            </span>
                        </div>
                        <p>
                            © 2026 Все права защищены. Использовано API
                            Kinopoisk.dev
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">
                                О проекте
                            </a>
                            <a href="#" className="hover:text-white">
                                API
                            </a>
                            <a href="#" className="hover:text-white">
                                Контакты
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
