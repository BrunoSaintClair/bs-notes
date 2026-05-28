import { useState, useEffect, useCallback } from "react";
import type { Post, Tag, DictionaryItem } from "@/types";
import { api, AuthExpiredError, PermissionDeniedError } from "@/services/api";
import Toast from "@/components/Toast/Toast";
import PostForm from "@/components/Admin/PostForm";
import PostList from "@/components/Admin/PostList";
import TagManager from "@/components/Admin/TagManager";
import DictionaryManager from "@/components/Admin/DictionaryManager";

interface AdminProps {
  token: string;
  tags: Tag[];
  dictionaryItems: DictionaryItem[];
  refreshData: () => void;
  onSessionExpired: () => void;
  onPermissionDenied: () => void;
}

type Tab = "posts" | "tags" | "dictionary";

export default function Admin({ token, tags, dictionaryItems, refreshData, onSessionExpired, onPermissionDenied }: AdminProps) {
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
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postDate, setPostDate] = useState(getTodayDate());
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postIsPublic, setPostIsPublic] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "warning" } | null>(null);

  const fetchAdminPosts = useCallback(async () => {
    try {
      setIsLoadingAdminPosts(true);
      const data = await api.getAdminPosts(token);
      setAdminPosts(data);
    } catch (error) {
      if (error instanceof AuthExpiredError) { onSessionExpired(); return; }
      if (error instanceof PermissionDeniedError) { onPermissionDenied(); return; }
      console.error(error);
    } finally {
      setIsLoadingAdminPosts(false);
    }
  }, [token, onSessionExpired, onPermissionDenied]);

  useEffect(() => {
    fetchAdminPosts();
  }, [fetchAdminPosts]);

  const handleAuthError = (error: unknown) => {
    if (error instanceof AuthExpiredError) { onSessionExpired(); return true; }
    if (error instanceof PermissionDeniedError) { onPermissionDenied(); return true; }
    return false;
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostDescription(post.description);
    setPostContent(post.content);
    setPostImage(post.image ?? "");
    setPostImageFile(null);
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
    setPostImageFile(null);
    setPostDate(getTodayDate());
    setPostTags([]);
    setPostIsPublic(true);
  };

  const handleTagToggle = (tagId: string) => {
    setPostTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
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
      setToast({ message: "Erro ao deletar tag.", type: "error" });
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
      setToast({ message: "Erro ao criar o termo.", type: "error" });
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
      setToast({ message: "Erro ao deletar termo.", type: "error" });
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDescription.trim() || !postContent.trim() || !postDate) return;
    if (postTags.length === 0) {
      setToast({ message: "Por favor, selecione pelo menos uma tag para o post.", type: "warning" });
      return;
    }
    try {
      setIsLoadingPost(true);
      
      let imageUrl = postImage;
      if (postImageFile) {
        const uploadResult = await api.uploadImage(postImageFile, token);
        imageUrl = uploadResult.url;
      }

      const payload = {
        title: postTitle,
        description: postDescription,
        content: postContent,
        image: imageUrl,
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
      setToast({ message: editingPostId ? "Erro ao atualizar o post." : "Erro ao criar o post.", type: "error" });
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
      setToast({ message: "Erro ao deletar post.", type: "error" });
    }
  };

  return (
    <div className="flex-1 w-full container mx-auto p-4">
      <h1 className="text-2xl font-bold mt-4 mb-6 flex justify-center dark:text-gray-100">Painel Administrativo</h1>

      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-2 overflow-x-auto">
        {(["posts", "tags", "dictionary"] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 transition-colors ${
              activeTab === tab
                ? "font-bold text-blue-600 dark:text-sky-blue border-b-2 border-blue-600 dark:border-sky-blue"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            }`}
          >
            {tab === "dictionary" ? "Dicionário" : tab}
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PostForm
            editingPostId={editingPostId}
            postTitle={postTitle}
            postDescription={postDescription}
            postContent={postContent}
            postImage={postImage}
            postImageFile={postImageFile}
            postDate={postDate}
            postTags={postTags}
            postIsPublic={postIsPublic}
            isLoading={isLoadingPost}
            availableTags={tags}
            onTitleChange={setPostTitle}
            onDescriptionChange={setPostDescription}
            onContentChange={setPostContent}
            onImageFileChange={setPostImageFile}
            onDateChange={setPostDate}
            onTagToggle={handleTagToggle}
            onIsPublicChange={setPostIsPublic}
            onSubmit={handleCreatePost}
            onCancel={resetPostForm}
          />
          <PostList
            posts={adminPosts}
            isLoading={isLoadingAdminPosts}
            onEdit={handleEditClick}
            onDelete={handleDeletePost}
          />
        </div>
      )}

      {activeTab === "tags" && (
        <TagManager
          tags={tags}
          tagName={tagName}
          isLoading={isLoadingTag}
          onTagNameChange={setTagName}
          onCreate={handleCreateTag}
          onDelete={handleDeleteTag}
        />
      )}

      {activeTab === "dictionary" && (
        <DictionaryManager
          items={dictionaryItems}
          term={term}
          definition={definition}
          isLoading={isLoadingDictionary}
          onTermChange={setTerm}
          onDefinitionChange={setDefinition}
          onCreate={handleCreateDictionaryItem}
          onDelete={handleDeleteDictionaryItem}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
