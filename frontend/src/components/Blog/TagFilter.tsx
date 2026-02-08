import type { Tag } from "../../types";

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onTagSelect: (tagId: string | null) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onTagSelect,
}: TagFilterProps) {
  return (
    <div className="flex gap-8 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
      <button
        onClick={() => onTagSelect(null)}
        className={`px-1 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
          selectedTag === null
            ? "text-text-primary border-b-sage-green"
            : "text-gray-400 border-b-transparent hover:text-gray-600"
        }`}
      >
        Todos
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.id)}
          className={`px-1 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
            selectedTag === tag.id
              ? "text-text-primary border-b-sage-green"
              : "text-gray-400 border-b-transparent hover:text-gray-600"
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
