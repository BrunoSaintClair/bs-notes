import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post } from "@/types";
import { api } from "@/services/api";
import { formatDate } from "@/utils/formatDate";
import { slugify } from "@/utils/slugify";
import ShareMenu from "@/components/Blog/ShareMenu";


export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Reading progress bar
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setReadingProgress(Math.min((scrollTop / docHeight) * 100, 100));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);

        const cachedJson = localStorage.getItem("bs_cached_posts");
        const posts: Post[] = cachedJson ? JSON.parse(cachedJson) : await api.getPosts();

        let found = posts.find((p) => p.id === postId || slugify(p.title) === postId);

        if (!found && cachedJson) {
          const freshPosts = await api.getPosts();
          found = freshPosts.find((p) => p.id === postId || slugify(p.title) === postId);
        }

        if (found) {
          setPost(found);
        } else {
          setError("Artigo não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar o artigo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-sky-blue rounded-full animate-spin" />
          <span className="text-sm font-medium">Carregando artigo...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
        <p className="text-red-500 text-sm">{error || "Artigo não encontrado."}</p>
        <button
          onClick={() => navigate("/")}
          className="text-sky-blue hover:text-sky-blue/80 text-sm font-medium transition-colors"
        >
          ← Voltar para o blog
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <article className="flex-1 w-full max-w-[720px] lg:max-w-[860px] mx-auto px-4 sm:px-6 py-10 md:py-16 shrink-0">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Article header */}
        <header className="mb-12 animate-fade-in-up">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.tags.map(tag => (
              <span
                key={tag.id}
                className="text-[11px] font-semibold uppercase text-sky-blue tracking-widest bg-sky-blue/8 dark:bg-sky-blue/15 px-3 py-1.5 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-gray-900 dark:text-white mb-5 leading-[1.1] tracking-tight font-heading">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 font-medium mb-8">
            <span>{formatDate(post.date)}</span>
          </div>

          {/* Share */}
          <div className="mb-8">
            <ShareMenu postId={post.id} postTitle={post.title} />
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl border-l-4 border-sky-blue pl-5 py-1">
            {post.description}
          </p>
        </header>

        {/* Featured image */}
        {post.image && !imgError && (
          <div className="w-full mb-14 rounded-xl overflow-hidden animate-fade-in-up-delay-1">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto max-h-[480px] object-cover rounded-xl"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {/* Article content */}
        <div
          className="post-content prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 animate-fade-in-up-delay-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share at bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <ShareMenu postId={post.id} postTitle={post.title} />
        </div>
      </article>
    </>
  );
}
