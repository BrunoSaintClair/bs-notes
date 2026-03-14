import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';
import type { User } from '@/types';
import { useTheme } from '@/components/Theme/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

interface HeaderProps {
  user: User | null;
  onLoginSuccess: (user: User, token: string) => void;
  onLogout: () => void;
}

const Header = ({ user, onLoginSuccess, onLogout }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const result = await api.loginGoogle(credentialResponse.credential);
                onLoginSuccess(result.user, result.access_token);
            } catch (error) {
                console.error("Erro ao autenticar no backend:", error);
            }
        }
    };

    return (
        <header className="bg-white dark:bg-gray-950 py-4 px-6 shadow-sm dark:shadow-gray-800 transition-colors duration-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                <div className="flex items-center">
                    <button onClick={() => navigate("/")} className="cursor-pointer hover:opacity-80 transition-opacity">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">BS Notes</h1>
                    </button>
                </div>

                <div className="flex items-center gap-8">
                    <nav className="flex gap-6 items-center">
                        <button
                            onClick={() => navigate("/")}
                            className={`font-medium transition-colors cursor-pointer ${
                              isActive("/") && !location.pathname.startsWith("/post")
                                ? "text-sky-blue border-b-2 border-b-sky-blue pb-1"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                        >
                            Blog
                        </button>
                        <button
                            onClick={() => navigate("/dictionary")}
                            className={`font-medium transition-colors cursor-pointer ${
                              isActive("/dictionary")
                                ? "text-sky-blue border-b-2 border-b-sky-blue pb-1"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                        >
                            Dicionário
                        </button>
                        <button
                            onClick={() => navigate("/about")}
                            className={`font-medium transition-colors cursor-pointer ${
                              isActive("/about")
                                ? "text-sky-blue border-b-2 border-b-sky-blue pb-1"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                        >
                            Sobre
                        </button>

                        {user && user.email === ADMIN_EMAIL && (
                            <button
                                onClick={() => navigate("/admin")}
                                className={`font-medium transition-colors cursor-pointer ${
                                isActive("/admin")
                                    ? "text-sky-blue border-b-2 border-b-sky-blue pb-1"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                }`}
                            >
                                Admin
                            </button>
                        )}
                    </nav>

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center"
                            aria-label="Alternar tema"
                            title={theme === 'dark' ? "Ativar tema claro" : "Ativar tema escuro"}
                        >
                            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3 animate-fade-in pl-2 border-l border-gray-200 dark:border-gray-700 sm:border-none sm:pl-0">
                                <div className="w-8 h-8 rounded-full bg-sky-blue/20 dark:bg-sky-blue/30 flex items-center justify-center text-sky-blue font-bold text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm hidden sm:block">
                                    {user.username}
                                </span>
                                <button 
                                    onClick={onLogout}
                                    className="ml-1 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                        <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Login falhou')}
                                useOneTap
                                theme={theme === 'dark' ? 'filled_black' : 'outline'}
                                shape="rectangular"
                                text="signin_with"
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
