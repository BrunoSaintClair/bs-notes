import { useState, useMemo } from "react";
import type { Post, Tag } from "../../types";
import PostCard from "./PostCard";

interface BlogProps {
  posts: Post[];
  tags: Tag[];
  onReadPost: (id: string) => void;
}

export default function Blog({ posts, tags, onReadPost }: BlogProps) {
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
          post.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, selectedTag, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, postsToShow);
  const hasMorePosts = filteredPosts.length > postsToShow;

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
      <div className="flex items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-1 py-2 font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              selectedTag === null
                ? "text-text-primary border-b-sage-green"
                : "text-gray-400 border-b-transparent hover:text-gray-600"
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
                  ? "text-text-primary border-b-sage-green"
                  : "text-gray-400 border-b-transparent hover:text-gray-600"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 min-w-fit px-3 py-2 rounded-lg transition-all duration-200 focus-within:bg-gray-100 focus-within:border-sage-green">
          <svg
            className="w-5 h-5 text-gray-400 transition-colors duration-200 focus-within:text-text-primary"
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
            className="bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm w-40 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="space-y-0">
        {filteredPosts.length > 0 ? (
          <>
            {displayedPosts.map((post) => (
              <PostCard key={post.id} post={post} onReadMore={() => onReadPost(post.id)} />
            ))}
            {hasMorePosts && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setPostsToShow(postsToShow + 5)}
                  className="px-6 py-2 text-sage-green font-medium hover:text-baltic-blue transition-colors border-b-2 border-b-sage-green hover:border-b-baltic-blue"
                >
                  Ver mais artigos
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
