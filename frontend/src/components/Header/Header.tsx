import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import type { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLoginSuccess: (user: User, token: string) => void;
  onLogout: () => void;
}

const Header = ({ user, onLoginSuccess, onLogout }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
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
        <header className="bg-white py-4 px-6 shadow-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                
                <div className="flex items-center gap-16">
                    <button onClick={() => navigate("/")} className="cursor-pointer hover:opacity-80 transition-opacity">
                        <h1 className="text-xl font-bold text-gray-900">BS Notes</h1>
                    </button>
                    <nav className="flex gap-8">
                        <button
                            onClick={() => navigate("/")}
                            className={`font-medium transition-colors cursor-pointer ${
                              isActive("/") && !location.pathname.startsWith("/post")
                                ? "text-text-primary border-b-2 border-b-sage-green pb-1"
                                : "text-gray-500 hover:text-gray-600"
                            }`}
                        >
                            Blog
                        </button>
                        <button
                            onClick={() => navigate("/dictionary")}
                            className={`font-medium transition-colors cursor-pointer ${
                              isActive("/dictionary")
                                ? "text-text-primary border-b-2 border-b-sage-green pb-1"
                                : "text-gray-500 hover:text-gray-600"
                            }`}
                        >
                            Dicionário
                        </button>
                        <button
                            onClick={() => navigate("/about")}
                            className={`font-medium transition-colors cursor-pointer ${
                              isActive("/about")
                                ? "text-text-primary border-b-2 border-b-sage-green pb-1"
                                : "text-gray-500 hover:text-gray-600"
                            }`}
                        >
                            Sobre
                        </button>

                        {user && user.email === ADMIN_EMAIL && (
                            <button
                                onClick={() => navigate("/admin")}
                                className={`font-medium transition-colors cursor-pointer ${
                                isActive("/admin")
                                    ? "text-text-primary border-b-2 border-b-sage-green pb-1"
                                    : "text-gray-500 hover:text-gray-600"
                                }`}
                            >
                                Admin
                            </button>
                        )}
                    </nav>
                </div>

                <div>
                    {user ? (
                        <div className="flex items-center gap-3 animate-fade-in">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700 font-medium text-sm">
                                {user.username}
                            </span>
                            <button 
                                onClick={onLogout}
                                className="ml-2 text-xs text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <div className="shadow-md rounded-md overflow-hidden">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Login falhou')}
                                useOneTap
                                theme="outline"
                                shape="rectangular"
                                text="signin_with"
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header;
