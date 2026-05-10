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

  const groupedItems = useMemo(() => {
    const groups: Record<string, DictionaryItem[]> = {};
    filteredItems.forEach((item) => {
      const letter = item.letter || item.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredItems]);

  return (
    <main className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-6 py-10 md:py-16 w-full">
      {/* Page header */}
      <div className="mb-12 md:mb-16 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight font-heading mb-4">
          Dicionário
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-2xl">
          Conheça termos e conceitos que devem aparecer em alguns posts.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 dark:border-gray-800/60 animate-fade-in-up-delay-1">
        {/* Alphabet pills */}
        <div className="w-full lg:w-auto">
          <div className="flex flex-wrap gap-1.5 pb-1 lg:hidden w-full">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedLetter === null
                  ? "text-sky-blue bg-sky-blue/8 dark:bg-sky-blue/10"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }`}
            >
              Todos
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedLetter === letter
                    ? "text-sky-blue bg-sky-blue/8 dark:bg-sky-blue/10"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedLetter(null)}
                className={`w-[70px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedLetter === null
                    ? "text-sky-blue bg-sky-blue/8 dark:bg-sky-blue/10"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                }`}
              >
                Todos
              </button>
              {alphabet.slice(0, 12).map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    selectedLetter === letter
                      ? "text-sky-blue bg-sky-blue/8 dark:bg-sky-blue/10"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {alphabet.slice(12).map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    selectedLetter === letter
                      ? "text-sky-blue bg-sky-blue/8 dark:bg-sky-blue/10"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-fit px-4 py-2.5 rounded-lg border border-transparent transition-all duration-200 focus-within:border-gray-200 dark:focus-within:border-gray-700 focus-within:bg-white dark:focus-within:bg-gray-800/50">
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0"
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
            placeholder="Procurar termo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none text-sm w-40 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="animate-fade-in-up-delay-2">
        {groupedItems.length > 0 ? (
          <div className="space-y-12">
            {groupedItems.map(([letter, terms]) => (
              <section key={letter}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-extrabold text-sky-blue font-heading">
                    {letter}
                  </span>
                  <div className="flex-1 h-px bg-gray-200/80 dark:bg-gray-800/60"></div>
                  <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {terms.length} {terms.length === 1 ? "termo" : "termos"}
                  </span>
                </div>

                {/* Terms */}
                <div className="space-y-1">
                  {terms.map((item) => (
                    <div
                      key={item.id}
                      className="group py-5 px-5 -mx-5 rounded-xl transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-heading tracking-tight">
                        {item.term}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed wrap-break-word">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500 text-sm">Nenhum termo encontrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}
