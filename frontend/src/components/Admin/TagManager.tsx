import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import type { Tag } from "@/types";

interface TagManagerProps {
  tags: Tag[];
  tagName: string;
  isLoading: boolean;
  onTagNameChange: (name: string) => void;
  onCreate: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
}

export default function TagManager({ tags, tagName, isLoading, onTagNameChange, onCreate, onDelete }: TagManagerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 h-fit">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FaPlus className="text-sm" /> Nova Tag
        </h2>
        <form onSubmit={onCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome da Tag
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => onTagNameChange(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: Investimentos, System Design, Livros..."
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Criando..." : "Criar Tag"}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Tags Existentes ({tags.length})
        </h2>

        <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
          {tags.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
              Nenhuma tag cadastrada.
            </p>
          ) : (
            <ul className="space-y-2">
              {tags.map(tag => (
                <li
                  key={tag.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">{tag.name}</span>
                  <button
                    onClick={() => onDelete(tag.id)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-gray-700 p-2 rounded-full transition-colors cursor-pointer"
                    title="Excluir tag"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
