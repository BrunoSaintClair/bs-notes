import { useEffect, useState } from "react";
import type { Post } from "../../types";
import { api } from "../../services/api";
import PostInteractions from "./PostInteractions";

interface PostDetailProps {
  postId: string;
  onBack: () => void;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  token?: string | null;
  onLoginRequired?: () => void;
}

export default function PostDetail({ postId, onBack, isAdmin = false, isLoggedIn = false, token, onLoginRequired }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
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
        <button onClick={onBack} className="text-blue-600 hover:underline">Voltar para o blog</button>
      </div>
    );
  }

  return (
    <article className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 shrink-0">
      <button 
        onClick={onBack}
        className="text-gray-500 hover:text-gray-900 mb-8 inline-flex items-center gap-2 transition-colors cursor-pointer"
      >
        ← Voltar
      </button>

      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          {post.tags.map(tag => (
            <span key={tag.id} className="text-sm font-bold uppercase text-sage-green tracking-widest bg-sage-green/10 px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 font-medium mb-8">
          <span>Publicado em {post.date.split('-').reverse().join('/')}</span>
          {isAdmin && (
            <>
              <span className="text-gray-300">·</span>
              <span>{post.views ?? 0} visualizações</span>
            </>
          )}
        </div>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed italic font-serif">
          {post.description}
        </p>
      </header>

      {post.image && !imgError && (
        <div className="w-full max-w-3xl mx-auto h-48 md:h-72 mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="prose prose-lg prose-blue max-w-none text-gray-800 leading-loose whitespace-pre-wrap font-serif">
        {post.content}
      </div>

      <PostInteractions postId={post.id} isAdmin={isAdmin} isLoggedIn={isLoggedIn} token={token} onLoginRequired={onLoginRequired} />
    </article>
  );
}
