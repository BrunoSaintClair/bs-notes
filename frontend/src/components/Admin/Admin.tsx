import { useState, useEffect, useCallback } from "react";
import { FaTrash, FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import type { Post, Tag, DictionaryItem } from "../../types";
import { api, AuthExpiredError } from "../../services/api";

interface AdminProps {
  token: string;
  tags: Tag[];
  dictionaryItems: DictionaryItem[];
  refreshData: () => void;
  onSessionExpired: () => void;
}

type Tab = "posts" | "tags" | "dictionary";

export default function Admin({ token, tags, dictionaryItems, refreshData, onSessionExpired }: AdminProps) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [adminPosts, setAdminPosts] = useState<Post[]>([]);
  const [isLoadingAdminPosts, setIsLoadingAdminPosts] = useState(true);


  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const [tagName, setTagName] = useState("");
  const [isLoadingTag, setIsLoadingTag] = useState(false);

  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [isLoadingDictionary, setIsLoadingDictionary] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postDate, setPostDate] = useState(getTodayDate());
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postIsPublic, setPostIsPublic] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const fetchAdminPosts = useCallback(async () => {
    try {
      setIsLoadingAdminPosts(true);
      const data = await api.getAdminPosts(token);
      setAdminPosts(data);
    } catch (error) {
      if (error instanceof AuthExpiredError) {
        onSessionExpired();
        return;
      }
      console.error(error);
    } finally {
      setIsLoadingAdminPosts(false);
    }
  }, [token, onSessionExpired]);

  useEffect(() => {
    fetchAdminPosts();
  }, [fetchAdminPosts]);

  const handleAuthError = (error: unknown) => {
    if (error instanceof AuthExpiredError) {
      onSessionExpired();
      return true;
    }
    return false;
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostDescription(post.description);
    setPostContent(post.content);
    setPostImage(post.image);
    setPostDate(post.date);
    setPostTags(post.tags.map(t => t.id));
    setPostIsPublic(post.is_public !== undefined ? post.is_public : true);
    setActiveTab("posts");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPostForm = () => {
    setEditingPostId(null);
    setPostTitle("");
    setPostDescription("");
    setPostContent("");
    setPostImage("");
    setPostDate(getTodayDate());
    setPostTags([]);
    setPostIsPublic(true);
  };

  
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      setIsLoadingTag(true);
      await api.createTag({ name: tagName }, token);
      
      setTagName("");
      refreshData();
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error(error);
    } finally {
      setIsLoadingTag(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await api.deleteTag(id, token);
      refreshData();
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error(error);
      alert("Erro ao deletar tag.");
    }
  };

  const handleCreateDictionaryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !definition.trim()) return;

    const letter = term.trim().charAt(0).toUpperCase();

    try {
      setIsLoadingDictionary(true);
      await api.createDictionaryItem({ term, definition, letter }, token);
      
      setTerm("");
      setDefinition("");
      refreshData();
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error(error);
      alert("Erro ao criar o termo.");
    } finally {
      setIsLoadingDictionary(false);
    }
  };

  const handleDeleteDictionaryItem = async (id: string) => {
    try {
      await api.deleteDictionaryItem(id, token);
      refreshData();
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error(error);
      alert("Erro ao deletar termo.");
    }
  };

  const handleTagToggle = (tagId: string) => {
    setPostTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDescription.trim() || !postContent.trim() || !postImage.trim() || !postDate) return;

    if (postTags.length === 0) {
      alert("Por favor, selecione pelo menos uma tag para o post.");
      return;
    }

    try {
      setIsLoadingPost(true);
      
      const payload = {
        title: postTitle,
        description: postDescription,
        content: postContent,
        image: postImage,
        date: postDate,
        tag_ids: postTags,
        is_public: postIsPublic,
      };

      if (editingPostId) {
        await api.updatePost(editingPostId, payload, token);
      } else {
        await api.createPost(payload, token);
      }

      resetPostForm();
      refreshData();
      fetchAdminPosts();
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error(error);
      alert(editingPostId ? "Erro ao atualizar o post." : "Erro ao criar o post.");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await api.deletePost(id, token);
      refreshData();
      fetchAdminPosts();
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error(error);
      alert("Erro ao deletar post.");
    }
  };

  return (
    <div className="flex-1 w-full container mx-auto p-4">
      <h1 className="text-2xl font-bold mt-4 mb-6 flex justify-center">Painel Administrativo</h1>
      
      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-2">
        {(["posts", "tags", "dictionary"] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 transition-colors ${
              activeTab === tab 
                ? "font-bold text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            {tab === "dictionary" ? "Dicionário" : tab}
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              {editingPostId ? (
                <><FaEdit className="text-sm" /> Editar Post</>
              ) : (
                <><FaPlus className="text-sm" /> Novo Post</>
              )}
            </h2>
            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  type="text" 
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: Como otimizar queries no banco..."
                  required
                  disabled={isLoadingPost}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea 
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                  placeholder="Um breve resumo do artigo..."
                  required
                  disabled={isLoadingPost}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (Artigo)</label>
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y h-48"
                  placeholder="Escreva o artigo completo aqui..."
                  required
                  disabled={isLoadingPost}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem de Capa</label>
                  <input 
                    type="url" 
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                    disabled={isLoadingPost}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Publicação</label>
                  <input 
                    type="date" 
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                    required
                    disabled={isLoadingPost}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags do Post</label>
                {tags.length === 0 ? (
                  <p className="text-sm text-red-500 italic">Crie algumas tags primeiro.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        disabled={isLoadingPost}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                          postTags.includes(tag.id)
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
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
                  onChange={(e) => setPostIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  disabled={isLoadingPost}
                />
                <label htmlFor="is_public" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Tornar post público e visível na Home
                </label>
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  type="submit" 
                  disabled={isLoadingPost}
                  className={`flex-1 ${editingPostId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoadingPost ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoadingPost ? "Salvando..." : (editingPostId ? "Atualizar Post" : "Publicar Post")}
                </button>

                {editingPostId && (
                  <button 
                    type="button" 
                    onClick={resetPostForm}
                    disabled={isLoadingPost}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Artigos Publicados ({adminPosts.length})
            </h2>
            
            <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingAdminPosts ? (
                <p className="text-gray-500 italic text-center py-8">
                  Carregando posts...
                </p>
              ) : adminPosts.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                  Nenhum post publicado ainda.
                </p>
              ) : (
                <ul className="space-y-4">
                  {adminPosts.map((post: Post) => (
                    <li 
                      key={post.id} 
                      className="flex gap-4 p-4 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors group relative"
                    >
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-20 h-20 object-cover rounded bg-gray-200 shrink-0"
                      />
                      <div className="flex-1 pr-8">
                        <h3 className="text-md font-bold text-gray-900 leading-tight">
                          {post.title}
                          {post.is_public === false && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 uppercase">
                              Privado
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.date.split('-').reverse().join('/')}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map(tag => (
                            <span key={tag.id} className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button 
                          onClick={() => handleEditClick(post)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Editar post"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
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
        </div>
      )}

      {activeTab === "tags" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <FaPlus className="text-sm" /> Nova Tag
            </h2>
            <form onSubmit={handleCreateTag} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Tag
                </label>
                <input 
                  type="text" 
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: Investimentos, System Design, Livros..."
                  required
                  disabled={isLoadingTag}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoadingTag}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoadingTag ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoadingTag ? "Criando..." : "Criar Tag"}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Tags Existentes ({tags.length})
            </h2>
            
            <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
              {tags.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                  Nenhuma tag cadastrada.
                </p>
              ) : (
                <ul className="space-y-2">
                  {tags.map(tag => (
                    <li 
                      key={tag.id} 
                      className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors group"
                    >
                      <span className="font-medium text-gray-700">{tag.name}</span>
                      <button 
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
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
      )}

      {activeTab === "dictionary" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <FaPlus className="text-sm" /> Novo Termo
            </h2>
            <form onSubmit={handleCreateDictionaryItem} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termo
                </label>
                <input 
                  type="text" 
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: API, Backend, Juros Compostos..."
                  required
                  disabled={isLoadingDictionary}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Definição
                </label>
                <textarea 
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-28"
                  placeholder="Digite a definição do termo..."
                  required
                  disabled={isLoadingDictionary}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoadingDictionary}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoadingDictionary ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoadingDictionary ? "Criando..." : "Criar Termo"}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Dicionário Existente ({dictionaryItems.length})
            </h2>
            
            <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
              {dictionaryItems.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                  Nenhum termo cadastrado.
                </p>
              ) : (
                <ul className="space-y-3">
                  {dictionaryItems.map(item => (
                    <li 
                      key={item.id} 
                      className="flex flex-col p-4 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors group relative"
                    >
                      <div className="pr-10">
                        <h3 className="text-lg font-bold text-blue-600">{item.term}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.definition}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteDictionaryItem(item.id)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
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
      )}
    </div>
  );
}
