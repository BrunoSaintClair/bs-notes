import { FaTrash, FaPlus } from "react-icons/fa";
import type { DictionaryItem } from "@/types";

interface DictionaryManagerProps {
  items: DictionaryItem[];
  term: string;
  definition: string;
  isLoading: boolean;
  onTermChange: (value: string) => void;
  onDefinitionChange: (value: string) => void;
  onCreate: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
}

export default function DictionaryManager({
  items, term, definition, isLoading,
  onTermChange, onDefinitionChange, onCreate, onDelete
}: DictionaryManagerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 h-fit">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FaPlus className="text-sm" /> Novo Termo
        </h2>
        <form onSubmit={onCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Termo
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => onTermChange(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: API, Backend, Juros Compostos..."
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Definição
            </label>
            <textarea
              value={definition}
              onChange={(e) => onDefinitionChange(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-28"
              placeholder="Digite a definição do termo..."
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Criando..." : "Criar Termo"}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Dicionário Existente ({items.length})
        </h2>

        <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
              Nenhum termo cadastrado.
            </p>
          ) : (
            <ul className="space-y-3">
              {[...items].sort((a, b) => a.term.localeCompare(b.term)).map(item => (
                <li
                  key={item.id}
                  className="flex flex-col p-4 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                >
                  <div className="pr-10">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-sky-blue">{item.term}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.definition}</p>
                  </div>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-gray-700 p-2 rounded-full transition-colors cursor-pointer"
                    title="Excluir termo"
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
