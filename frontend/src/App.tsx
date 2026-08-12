import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>(() => {
    const cached = localStorage.getItem("bs_cached_posts");
    return cached ? JSON.parse(cached) : [];
  });
  const [tags, setTags] = useState<Tag[]>(() => {
    const cached = localStorage.getItem("bs_cached_tags");
    return cached ? JSON.parse(cached) : [];
  });
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>(() => {
    const cached = localStorage.getItem("bs_cached_dictionary");
    return cached ? JSON.parse(cached) : [];
  });

  const [pendingPostsUpdate, setPendingPostsUpdate] = useState<Post[] | null>(null);

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const cachedPosts = localStorage.getItem("bs_cached_posts");
    return !cachedPosts;
  });
  const [error, setError] = useState<string | null>(null);

  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type?: "error" | "success" | "warning" | "info";
    duration?: number;
    actionLabel?: string;
    onClickAction?: () => void;
  } | null>(null);

  const lastFocusFetchRef = useRef<number>(Date.now());

  const showToast = useCallback((
    message: string,
    type: "error" | "success" | "warning" | "info" = "warning",
    actionLabel?: string,
    onClickAction?: () => void
  ) => {
    setToastConfig({ message, type, duration: 6000, actionLabel, onClickAction });
  }, []);

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
    showToast("Sua sessão expirou. Faça login novamente para acessar o painel administrativo.", "warning");
  };

  const handlePermissionDenied = useCallback(() => {
    navigate("/");
    showToast("Você não tem permissão para acessar a área administrativa.", "warning");
  }, [navigate, showToast]);

  useEffect(() => {
    if (pendingPostsUpdate) {
      setPosts(pendingPostsUpdate);
      localStorage.setItem("bs_cached_posts", JSON.stringify(pendingPostsUpdate));
      setPendingPostsUpdate(null);
    }
  }, [location.pathname, pendingPostsUpdate]);

  const fetchInitialData = useCallback(async (isExplicitRefresh = false) => {
    try {
      const cachedPostsJson = localStorage.getItem("bs_cached_posts");
      const cachedPosts: Post[] = cachedPostsJson ? JSON.parse(cachedPostsJson) : [];

      if (cachedPosts.length === 0 && !isExplicitRefresh) {
        setIsLoading(true);
      }

      const [postsData, tagsData] = await Promise.all([
        api.getPosts(),
        api.getTags(),
      ]);

      if (JSON.stringify(tagsData) !== localStorage.getItem("bs_cached_tags")) {
        setTags(tagsData);
        localStorage.setItem("bs_cached_tags", JSON.stringify(tagsData));
      }

      const postsChanged = JSON.stringify(postsData) !== JSON.stringify(cachedPosts);

      if (postsChanged) {
        if (cachedPosts.length === 0 || isExplicitRefresh) {
          setPosts(postsData);
          localStorage.setItem("bs_cached_posts", JSON.stringify(postsData));
          setPendingPostsUpdate(null);
        } else {
          setPendingPostsUpdate(postsData);

          const isNew = postsData.length > cachedPosts.length;
          const msg = isNew
            ? "Novo artigo publicado no blog!"
            : "Conteúdo do blog atualizado.";


          showToast(
            msg,
            "info",
            "Clique para atualizar a tela",
            () => {
              setPosts(postsData);
              localStorage.setItem("bs_cached_posts", JSON.stringify(postsData));
              setPendingPostsUpdate(null);
            }
          );
        }
      }
    } catch (err) {
      console.error("Revalidação em segundo plano:", err);
      if (!localStorage.getItem("bs_cached_posts")) {
        setError("Erro ao carregar dados.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const fetchDictionary = useCallback(async () => {
    try {
      const data = await api.getDictionaryItems();
      const cachedDictJson = localStorage.getItem("bs_cached_dictionary");
      if (JSON.stringify(data) !== cachedDictJson) {
        setDictionaryItems(data);
        localStorage.setItem("bs_cached_dictionary", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Revalidação do dicionário:", err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusFetchRef.current > 15000) {
        lastFocusFetchRef.current = now;
        fetchInitialData();
        fetchDictionary();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchInitialData, fetchDictionary]);

  const refreshData = useCallback(async () => {
    await fetchInitialData(true);
    await fetchDictionary();
  }, [fetchInitialData, fetchDictionary]);


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

      {toastConfig && (
        <Toast 
          message={toastConfig.message} 
          type={toastConfig.type} 
          duration={toastConfig.duration}
          actionLabel={toastConfig.actionLabel}
          onClickAction={toastConfig.onClickAction}
          onClose={() => setToastConfig(null)} 
        />
      )}
    </div>
  );
}

export default App;
