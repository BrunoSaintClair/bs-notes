import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '@/types';
import { useTheme } from '@/components/Theme/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const isAdmin = user && user.email === ADMIN_EMAIL;

    const navLinks = [
        { label: "Blog", path: "/", active: isActive("/") && !location.pathname.startsWith("/post") },
        { label: "Dicionário", path: "/dicionario", active: isActive("/dicionario") },
        { label: "Sobre", path: "/sobre", active: isActive("/sobre") },
        ...(isAdmin
            ? [{ label: "Admin", path: "/admin", active: isActive("/admin") }]
            : []),
    ];

    return (
        <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl py-4 px-6 border-b border-gray-200/60 dark:border-gray-800/60 transition-colors duration-300 sticky top-0 z-50">
            <div className="max-w-[1120px] mx-auto flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center">
                    <button onClick={() => { navigate("/"); setMenuOpen(false); }} className="cursor-pointer group">
                        <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-colors font-heading group-hover:text-sky-blue dark:group-hover:text-sky-blue">
                            BS Notes
                        </h1>
                    </button>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex gap-1 items-center">
                        {navLinks.map(link => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    link.active
                                        ? "text-sky-blue bg-sky-blue/8 dark:bg-sky-blue/10"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="w-px h-5 bg-gray-200 dark:bg-gray-800"></div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer shrink-0"
                            aria-label="Alternar tema"
                            title={theme === 'dark' ? "Ativar tema claro" : "Ativar tema escuro"}
                        >
                            {theme === 'dark' ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
                        </button>

                        {isAdmin && (
                            <div className="flex items-center gap-3 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-sky-blue/10 dark:bg-sky-blue/20 flex items-center justify-center text-sky-blue font-bold text-sm border border-sky-blue/20">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="ml-1 text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile: theme toggle + hamburger */}
                <div className="flex md:hidden items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        aria-label="Alternar tema"
                    >
                        {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        aria-label="Menu"
                    >
                        {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="md:hidden mt-3 border-t border-gray-100 dark:border-gray-800/60 pt-3 pb-2 flex flex-col gap-1 animate-fade-in">
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            onClick={() => { navigate(link.path); setMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                link.active
                                    ? "text-sky-blue bg-sky-blue/5 dark:bg-sky-blue/10"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}

                    {isAdmin && (
                        <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800/60 px-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-sky-blue/10 dark:bg-sky-blue/20 flex items-center justify-center text-sky-blue font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.username}</span>
                                </div>
                                <button
                                    onClick={() => { onLogout(); setMenuOpen(false); }}
                                    className="text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
