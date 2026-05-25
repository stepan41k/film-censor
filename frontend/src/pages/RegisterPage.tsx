import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserPlus, LogIn, Lock, User, ShieldCheck } from "lucide-react";

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post("http://localhost:8000/register", {
                username: username,
                password: password,
            });

            alert("Регистрация успешна! Теперь вы можете войти.");
            navigate("/login");
        } catch (err: unknown) {
            console.error(err);

            let message = "Ошибка при регистрации";

            if (axios.isAxiosError(err) && err.response) {
                message = err.response.data.detail || message;
            }

            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-300">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-green-600/20 rounded-2xl mb-4">
                        <UserPlus className="text-green-500" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white">
                        Создать аккаунт
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Присоединяйтесь к сообществу киноманов
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User
                            className="absolute left-3 top-3.5 text-gray-500"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Придумайте никнейм"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-all"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="relative">
                        <Lock
                            className="absolute left-3 top-3.5 text-gray-500"
                            size={20}
                        />
                        <input
                            type="password"
                            placeholder="Придумайте пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-all"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="relative">
                        <ShieldCheck
                            className="absolute left-3 top-3.5 text-gray-500"
                            size={20}
                        />
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                    >
                        {isLoading ? "Создание..." : "Зарегистрироваться"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-gray-500 mb-2">Уже есть аккаунт?</p>
                    <Link
                        to="/login"
                        className="text-green-400 font-bold hover:text-green-300 transition-colors flex items-center justify-center gap-1"
                    >
                        <LogIn size={18} />
                        Войти в систему
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
