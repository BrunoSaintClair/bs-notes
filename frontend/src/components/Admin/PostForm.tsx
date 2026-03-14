import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import type { Tag } from "@/types";
import RichTextEditor from "@/components/Admin/RichTextEditor";

interface PostFormProps {
  editingPostId: string | null;
  postTitle: string;
  postDescription: string;
  postContent: string;
  postImage: string;
  postDate: string;
  postTags: string[];
  postIsPublic: boolean;
  isLoading: boolean;
  availableTags: Tag[];
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onImageChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onTagToggle: (tagId: string) => void;
  onIsPublicChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function PostForm({
  editingPostId, postTitle, postDescription, postContent, postImage,
  postDate, postTags, postIsPublic, isLoading, availableTags,
  onTitleChange, onDescriptionChange, onContentChange, onImageChange,
  onDateChange, onTagToggle, onIsPublicChange, onSubmit, onCancel,
}: PostFormProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 h-fit">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        {editingPostId ? (
          <><FaEdit className="text-sm" /> Editar Post</>
        ) : (
          <><FaPlus className="text-sm" /> Novo Post</>
        )}
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Ex: Como otimizar queries no banco..."
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
          <textarea
            value={postDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
            placeholder="Um breve resumo do artigo..."
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conteúdo (Artigo)</label>
          <RichTextEditor
            content={postContent}
            onContentChange={onContentChange}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL da Imagem de Capa</label>
            <input
              type="url"
              value={postImage}
              onChange={(e) => onImageChange(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://exemplo.com/imagem.jpg (opcional)"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Publicação</label>
            <input
              type="date"
              value={postDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags do Post</label>
          {availableTags.length === 0 ? (
            <p className="text-sm text-red-500 italic">Crie algumas tags primeiro.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onTagToggle(tag.id)}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                    postTags.includes(tag.id)
                      ? "bg-blue-100 dark:bg-sky-blue/20 text-blue-700 dark:text-sky-blue border-blue-300 dark:border-sky-blue"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="is_public"
            checked={postIsPublic}
            onChange={(e) => onIsPublicChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 dark:text-sky-blue border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-sky-blue cursor-pointer"
            disabled={isLoading}
          />
          <label htmlFor="is_public" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Tornar post público e visível na Home
          </label>
        </div>

        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 ${editingPostId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Salvando..." : (editingPostId ? "Atualizar Post" : "Publicar Post")}
          </button>

          {editingPostId && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
