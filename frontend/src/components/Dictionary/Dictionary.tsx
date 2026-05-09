import { useState, useMemo, useEffect } from "react";
import type { DictionaryItem } from "@/types";

interface DictionaryProps {
  items: DictionaryItem[];
  onMount?: () => void;
}

export default function Dictionary({ items, onMount }: DictionaryProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesLetter = selectedLetter ? item.letter === selectedLetter : true;
      const matchesQuery = searchQuery.trim() 
        ? item.term.toLowerCase().includes(searchQuery.trim().toLowerCase()) 
        : true;
      return matchesLetter && matchesQuery;
    });

    filtered.sort((a, b) => a.term.localeCompare(b.term));
    return filtered;
  }, [items, selectedLetter, searchQuery]);

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-2">Dicionário</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Conheça termos e conceitos que devem aparecer em alguns posts.</p>

        <div className="flex items-center gap-3 mb-8 min-w-fit px-3 py-2 rounded-lg transition-all duration-200 focus-within:bg-gray-100 dark:focus-within:bg-gray-800 focus-within:border-sage-green dark:focus-within:border-sky-blue">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-200 focus-within:text-gray-900 dark:focus-within:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Procurar palavra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm w-full md:w-96 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="mb-12 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setSelectedLetter(null)}
          className={`px-8 py-3 rounded-lg transition-all font-bold text-sm min-w-24 ${
            selectedLetter === null
              ? "bg-sky-blue text-white border-2 border-sky-blue"
              : "bg-gray-100 text-gray-700 border-2 border-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-700 cursor-pointer"
          }`}
        >
          Todos
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all font-extrabold text-lg cursor-pointer ${
              selectedLetter === letter
                ? "bg-sky-blue text-white border-2 border-sky-blue"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="border-l-4 border-sky-blue pl-4">
              <h3 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-2">
                {item.term}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 wrap-break-word overflow-hidden">{item.definition}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-500">Nenhum termo encontrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}
