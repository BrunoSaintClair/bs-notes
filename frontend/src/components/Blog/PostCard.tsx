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
    <article className="group py-8 md:py-10 border-b border-gray-200/80 dark:border-gray-800/60 last:border-b-0 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Thumbnail */}
        <div
          className="shrink-0 w-full h-48 sm:w-60 sm:h-44 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800/50 cursor-pointer"
          onClick={onReadMore}
        >
          {post.image && !imgError ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700/50 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          <div>
            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
              {post.tags.length > 0 && (
                <>
                  <span className="text-[13px] font-semibold uppercase text-sky-blue tracking-widest">
                    {post.tags[0].name}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                </>
              )}
              <p className="text-[13px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-[0.05em]">
                {formatDate(post.date)}
              </p>
            </div>

            {/* Title */}
            <h3
              className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug cursor-pointer hover:text-sky-blue dark:hover:text-sky-blue transition-colors duration-200 font-heading tracking-tight"
              onClick={onReadMore}
            >
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
              {post.description}
            </p>
          </div>

          {/* Read more */}
          <button
            onClick={onReadMore}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-sky-blue dark:hover:text-sky-blue transition-all duration-200 cursor-pointer group/btn w-fit"
          >
            Ler artigo
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
