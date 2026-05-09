import type { Post } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface HeroSectionProps {
  post: Post;
  onReadMore: () => void;
}

export default function HeroSection({ post, onReadMore }: HeroSectionProps) {
  return (
    <section className="relative mb-16 md:mb-24 animate-fade-in-up">
      {/* Featured article card */}
      <div 
        className="group relative overflow-hidden rounded-2xl cursor-pointer"
        onClick={onReadMore}
      >
        {/* Image */}
        <div className="relative h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-gray-950/90 via-gray-950/40 to-transparent" />
        </div>

        {/* Content over image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            {post.tags.length > 0 && (
              <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-blue bg-sky-blue/15 px-3 py-1 rounded-full backdrop-blur-sm">
                {post.tags[0].name}
              </span>
            )}
            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-300">
              {formatDate(post.date)}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight font-heading mb-3 max-w-3xl">
            {post.title}
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-5 line-clamp-2">
            {post.description}
          </p>

          <div className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all duration-300">
            Ler artigo
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
