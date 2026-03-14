import { useState } from "react";
import type { Post } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface PostCardProps {
  post: Post;
  onReadMore: () => void;
}

export default function PostCard({ post, onReadMore }: PostCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex gap-8 pb-12 mb-12 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
      <div className="shrink-0 w-56 h-44">
        {post.image && !imgError ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-lg bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Sem imagem</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-6 mb-3">
          {post.tags.length > 0 && (
            <>
              <span className="text-xs font-bold uppercase text-sage-green dark:text-sky-blue tracking-widest">
                {post.tags[0].name}
              </span>
              <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
            </>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {formatDate(post.date)}
          </p>
        </div>

        <h3 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight cursor-pointer hover:text-baltic-blue dark:hover:text-sky-blue transition-colors"
          onClick={onReadMore}
        >
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.description}
        </p>

        <button
          onClick={onReadMore}
          className="text-gray-900 dark:text-gray-300 font-semibold text-sm hover:text-baltic-blue dark:hover:text-sky-blue transition-colors inline-block cursor-pointer"
        >
          Ler artigo →
        </button>
      </div>
    </article>
  );
}
