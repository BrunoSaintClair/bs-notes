import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

const PermissionDeniedRedirect = ({ onDenied }: { onDenied: () => void }) => {
  useEffect(() => {
    onDenied();
  }, [onDenied]);
  return null;
};

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
        onLoginSuccess={handleLoginSuccess} 
        onLogout={handleLogout} 
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">Carregando...</div>
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
            <PostDetail 
              isAdmin={user?.is_admin ?? false}
              isLoggedIn={!!user}
              token={token}
              onLoginRequired={() => setToastMessage("Para interagir, faça login. Suas interações não ficam públicas, apenas o dono do site pode visualizá-las.")}
            />
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
              <div className="text-center mt-10 text-red-600">Acesso Negado. Faça login como admin.</div>
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
