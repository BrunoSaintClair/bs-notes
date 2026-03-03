import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Blog from "./components/Blog/Blog";
import Dictionary from "./components/Dictionary/Dictionary";
import About from "./components/About/About";
import Admin from "./components/Admin/Admin";
import PostDetail from "./components/Blog/PostDetail";
import Toast from "./components/Toast/Toast";
import type { Post, Tag, DictionaryItem, User } from "./types";
import { api } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState<"blog" | "dictionary" | "about" | "admin" | "post">("blog");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
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
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setCurrentPage("blog");
    setSelectedPostId(null);
  };

  const handleSessionExpired = () => {
    handleLogout();
    setToastMessage("Sua sessão expirou. Faça login novamente para acessar o painel administrativo.");
  };

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const [postsData, tagsData, dictionaryData] = await Promise.all([
        api.getPosts(),
        api.getTags(),
        api.getDictionaryItems(),
      ]);
      setPosts(postsData);
      setTags(tagsData);
      setDictionaryItems(dictionaryData);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => fetchData(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        user={user} 
        onLoginSuccess={handleLoginSuccess} 
        onLogout={handleLogout} 
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">Carregando...</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
      ) : (
        <>
          {currentPage === "blog" && (
            <Blog 
              posts={posts.filter((p) => p.is_public !== false)} 
              tags={tags} 
              onReadPost={(id) => {
                setSelectedPostId(id);
                setCurrentPage("post");
              }}
            />
          )}

          {currentPage === "post" && selectedPostId && (
            <PostDetail 
              postId={selectedPostId} 
              onBack={() => {
                setSelectedPostId(null);
                setCurrentPage("blog");
              }} 
            />
          )}

          {currentPage === "dictionary" && <Dictionary items={dictionaryItems} />}
          {currentPage === "about" && <About />}
          
          {currentPage === "admin" && (user && token ? (
              <Admin 
                token={token}
                tags={tags} 
                dictionaryItems={dictionaryItems}
                refreshData={refreshData}
                onSessionExpired={handleSessionExpired}
              />
            ) : (
              <div className="text-center mt-10 text-red-600">Acesso Negado. Faça login como admin.</div>
            )
          )}
        </>
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
