import type { Post, Tag, DictionaryItem, User, PostCreate, TagCreate, DictionaryItemCreate } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export class AuthExpiredError extends Error {
  constructor(message = "Sessão expirada. Faça login novamente.") {
    super(message);
    this.name = "AuthExpiredError";
  }
}

export class PermissionDeniedError extends Error {
  constructor(message = "Você não tem permissão para acessar esta área.") {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
});

const checkAuth = (response: Response) => {
  if (response.status === 401) {
    throw new AuthExpiredError();
  }
  if (response.status === 403) {
    throw new PermissionDeniedError();
  }
};

export const api = {
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts/?limit=100`);
    if (!response.ok) throw new Error("Erro buscando posts");
    return response.json();
  },

  getAdminPosts: async (token: string): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts/admin?limit=100`, {
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro buscando todos os posts para admin");
    return response.json();
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) throw new Error("Erro buscando post");
    return response.json();
  },

  getTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_URL}/tags/?limit=100`);
    if (!response.ok) throw new Error("Erro buscando tags");
    return response.json();
  },    

  getDictionaryItems: async (): Promise<DictionaryItem[]> => {
    const response = await fetch(`${API_URL}/dictionary/?limit=1000`);
    if (!response.ok) throw new Error("Erro buscando itens do dicionário");
    const data = await response.json();
    return data.items; 
  },

  loginGoogle: async (token: string): Promise<{ user: User; access_token: string }> => {
    const response = await fetch(`${API_URL}/users/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Falha no login com Google");
    }
    return response.json();
  },

  createPost: async (post: PostCreate, token: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(post),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao criar post");
    return response.json();
  },

  updatePost: async (id: string, post: PostCreate, token: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(post),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao atualizar post");
    return response.json();
  },

  deletePost: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao deletar post");
  },

  createTag: async (tag: TagCreate, token: string): Promise<Tag> => {
    const response = await fetch(`${API_URL}/tags/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(tag),
    });
    checkAuth(response);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Erro ao criar tag");
    }
    return response.json();
  },

  deleteTag: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao deletar tag");
  },

  createDictionaryItem: async (item: DictionaryItemCreate, token: string): Promise<DictionaryItem> => {
    const response = await fetch(`${API_URL}/dictionary/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(item),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao criar item");
    return response.json();
  },

  updateDictionaryItem: async (id: string, item: DictionaryItemCreate, token: string): Promise<DictionaryItem> => {
    const response = await fetch(`${API_URL}/dictionary/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(item),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao atualizar item");
    return response.json();
  },

  deleteDictionaryItem: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/dictionary/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao deletar item");
  },

  sendFeedback: async (data: { name: string; email: string; message: string }): Promise<void> => {
    const response = await fetch(`${API_URL}/feedback/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Erro ao enviar feedback");
    }
  },

  uploadImage: async (file: File, token: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao fazer upload da imagem");
    return response.json();
  },

};
