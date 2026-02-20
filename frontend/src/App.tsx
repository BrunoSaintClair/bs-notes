// src/App.tsx
import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Blog from "./components/Blog/Blog";
import Dictionary from "./components/Dictionary/Dictionary";
import About from "./components/About/About";
import Admin from "./components/Admin/Admin";
import PostDetail from "./components/Blog/PostDetail";
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

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const postsPromise = token ? api.getAdminPosts(token) : api.getPosts();

      const [postsData, tagsData, dictionaryData] = await Promise.all([
        postsPromise,
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
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <div className="flex-1 flex items-center justify-center">Loading...</div>
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
                posts={posts} 
                tags={tags} 
                dictionaryItems={dictionaryItems}
                refreshData={refreshData}
              />
            ) : (
              <div className="text-center mt-10 text-red-600">Acesso Negado. Faça login como admin.</div>
            )
          )}
        </>
      )}
      
      <Footer />
    </div>
  );
}

export default App;
