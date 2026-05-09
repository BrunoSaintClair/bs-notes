import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, Tag } from "@/types";
import PostCard from "@/components/Blog/PostCard";

interface BlogProps {
  posts: Post[];
  tags: Tag[];
}

export default function Blog({ posts, tags }: BlogProps) {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [postsToShow, setPostsToShow] = useState<number>(5);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => tag.id === selectedTag)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, selectedTag, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, postsToShow);
  const hasMorePosts = filteredPosts.length > postsToShow;

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar pb-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-1 py-2 font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              selectedTag === null
                ? "text-sky-blue dark:text-white border-b-sky-blue"
                : "text-gray-400 dark:text-gray-500 border-b-transparent hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Todos
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-1 py-2 font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                selectedTag === tag.id
                  ? "text-sky-blue dark:text-white border-b-sky-blue"
                  : "text-gray-400 dark:text-gray-500 border-b-transparent hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 min-w-fit px-3 py-2 rounded-lg transition-all duration-200 focus-within:bg-gray-100 dark:focus-within:bg-gray-800 focus-within:border-sage-green dark:focus-within:border-sky-blue">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-200 focus-within:text-gray-900 dark:focus-within:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Procurar artigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm w-40 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="space-y-0">
        {filteredPosts.length > 0 ? (
          <>
            {displayedPosts.map((post) => (
              <PostCard key={post.id} post={post} onReadMore={() => navigate(`/post/${post.id}`)} />
            ))}
            {hasMorePosts && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setPostsToShow(postsToShow + 5)}
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-sky-blue transition-all shadow-sm cursor-pointer"
                >
                  Ver mais artigos
                  <svg 
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-sky-blue transition-colors" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum post foi encontrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}
