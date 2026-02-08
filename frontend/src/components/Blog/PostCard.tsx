import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex gap-8 pb-12 mb-12 border-b border-gray-200 last:border-b-0">
      <div className="shrink-0 w-56 h-44">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-6 mb-3">
          {post.tags.length > 0 && (
            <>
              <span className="text-xs font-bold uppercase text-sage-green tracking-widest">
                {post.tags[0].name}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            </>
          )}
          <p className="text-xs text-gray-400 font-medium">{post.date}</p>
        </div>

        <h3 className="text-2xl font-bold text-text-primary mb-4 leading-tight">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.description}
        </p>

        <a
          href="#"
          className="text-text-primary font-semibold text-sm hover:text-baltic-blue transition-colors inline-block"
        >
          Ler artigo →
        </a>
      </div>
    </article>
  );
}
