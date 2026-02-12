import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Blog from "./components/Blog/Blog";
import Dictionary from "./components/Dictionary/Dictionary";
import type { Post, Tag, DictionaryItem } from "./types";
import { api } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState<"blog" | "dictionary">("blog");
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
        setError("Erro ao carregar dados ou não existem dados cadastrados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-700">{error}</p>
        </div>
      ) : (
        <>
          {currentPage === "blog" ? (
            <Blog posts={posts} tags={tags} />
          ) : (
            <Dictionary items={dictionaryItems} />
          )}
        </>
      )}
      
      <Footer />
    </div>
  );
}

export default App;
