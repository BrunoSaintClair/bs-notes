import { FaTrash } from "react-icons/fa";
import type { Post } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

import { FaEdit } from "react-icons/fa";

export default function PostList({ posts, isLoading, onEdit, onDelete }: PostListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Artigos Publicados ({posts.length})
      </h2>

      <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
            Carregando posts...
          </p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
            Nenhum post publicado ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post: Post) => (
              <li
                key={post.id}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-20 h-20 object-cover rounded bg-gray-200 dark:bg-gray-700 shrink-0"
                />
                <div className="flex-1 pr-8">
                  <h3 className="text-md font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {post.title}
                    {post.is_public === false && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 uppercase">
                        Privado
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(post.date)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map(tag => (
                      <span key={tag.id} className="text-[10px] font-bold uppercase text-blue-600 dark:text-sky-blue bg-blue-50 dark:bg-sky-blue/10 px-1.5 py-0.5 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 p-2 rounded-full transition-colors cursor-pointer"
                    title="Editar post"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-gray-700 p-2 rounded-full transition-colors cursor-pointer"
                    title="Excluir post"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
