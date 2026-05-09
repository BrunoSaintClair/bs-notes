import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post } from "@/types";
import { api } from "@/services/api";
import { formatDate } from "@/utils/formatDate";
import PostInteractions from "@/components/Blog/PostInteractions";
import ShareMenu from "@/components/Blog/ShareMenu";

interface PostDetailProps {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  token?: string | null;
  onLoginRequired?: () => void;
}

export default function PostDetail({ isAdmin = false, isLoggedIn = false, token, onLoginRequired }: PostDetailProps) {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        if (isLoggedIn && token) {
          api.registerView(postId, token).catch(console.error);
        }
        const data = await api.getPost(postId);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar o artigo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, isLoggedIn, token]);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center p-8">Carregando artigo...</div>;
  }

  if (error || !post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
        <p className="text-red-500">{error || "Artigo não encontrado."}</p>
        <button onClick={() => navigate("/")} className="text-blue-600 hover:underline">Voltar para o blog</button>
      </div>
    );
  }

  return (
    <article className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 shrink-0">
      <button 
        onClick={() => navigate("/")}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 inline-flex items-center gap-2 transition-colors cursor-pointer"
      >
        ← Voltar
      </button>

      <header className="mb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {post.tags.map(tag => (
            <span key={tag.id} className="text-sm font-bold uppercase text-sky-blue tracking-widest bg-blue-50 dark:bg-sky-blue/20 px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium mb-8">
          <span>Publicado em {formatDate(post.date)}</span>
          {isAdmin && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>{post.views ?? 0} visualizações</span>
            </>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <ShareMenu postId={post.id} postTitle={post.title} />
        </div>
        
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed italic font-serif">
          {post.description}
        </p>
      </header>

      {post.image && !imgError && (
        <div className="w-full max-w-3xl mx-auto h-48 md:h-72 mb-12 rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-900/50">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div
        className="post-content prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <PostInteractions postId={post.id} postTitle={post.title} isAdmin={isAdmin} isLoggedIn={isLoggedIn} token={token} onLoginRequired={onLoginRequired} />
    </article>
  );
}
