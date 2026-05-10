import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Blog from "@/components/Blog/Blog";
import Dictionary from "@/components/Dictionary/Dictionary";
import About from "@/components/About/About";
import Admin from "@/components/Admin/Admin";
import PostDetail from "@/components/Blog/PostDetail";
import Toast from "@/components/Toast/Toast";
import type { Post, Tag, DictionaryItem, User } from "@/types";
import { api } from "@/services/api";
import { useTheme } from "@/components/Theme/ThemeContext";

const PermissionDeniedRedirect = ({ onDenied }: { onDenied: () => void }) => {
  useEffect(() => {
    onDenied();
  }, [onDenied]);
  return null;
};

function AdminLogin({ onLoginSuccess }: { onLoginSuccess: (user: User, token: string) => void }) {
  const { theme } = useTheme();

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
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-heading">Área Administrativa</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Faça login para continuar.</p>
        </div>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Login falhou')}
          theme={theme === 'dark' ? 'filled_black' : 'outline'}
          shape="rectangular"
          text="signin_with"
        />
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLoginSuccess = (userData: User, rawToken: string) => {
    setUser(userData);
    setToken(rawToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", rawToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate("/");
  };

  const handleSessionExpired = () => {
    handleLogout();
    setToastMessage("Sua sessão expirou. Faça login novamente para acessar o painel administrativo.");
  };

  const handlePermissionDenied = useCallback(() => {
    navigate("/");
    setToastMessage("Você não tem permissão para acessar a área administrativa.");
  }, [navigate]);

  const fetchInitialData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const [postsData, tagsData] = await Promise.all([
        api.getPosts(),
        api.getTags(),
      ]);
      setPosts(postsData);
      setTags(tagsData);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  const fetchDictionary = useCallback(async () => {
    if (dictionaryItems.length > 0) return;
    try {
      const data = await api.getDictionaryItems();
      setDictionaryItems(data);
    } catch (err) {
      console.error(err);
    }
  }, [dictionaryItems.length]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const refreshData = () => fetchInitialData(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        user={user} 
        onLogout={handleLogout} 
      />

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
          <div className="w-12 h-12 border-4 border-sky-200 dark:border-sky-900 border-t-sky-500 dark:border-t-sky-500 rounded-full animate-spin mb-6 shadow-md"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
            Preparando tudo...
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            O servidor back-end pode estar hibernando e iniciando no momento. Isso pode levar alguns segundos adicionais. Obrigado pela paciência!
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
      ) : (
        <Routes>
          <Route path="/" element={
            <Blog 
              posts={posts} 
              tags={tags} 
            />
          } />

          <Route path="/post/:postId" element={
            <PostDetail />
          } />

          <Route path="/dicionario" element={<Dictionary items={dictionaryItems} onMount={fetchDictionary} />} />
          <Route path="/sobre" element={<About />} />
          
          <Route path="/admin" element={
            user && token ? (
              user.is_admin ? (
                <Admin 
                  token={token}
                  tags={tags} 
                  dictionaryItems={dictionaryItems}
                  refreshData={refreshData}
                  onSessionExpired={handleSessionExpired}
                  onPermissionDenied={handlePermissionDenied}
                />
              ) : (
                <PermissionDeniedRedirect onDenied={handlePermissionDenied} />
              )
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          } />
        </Routes>
      )}
      
      <Footer />

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="warning" 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

export default App;
