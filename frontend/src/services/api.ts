import type { Post, Tag, DictionaryItem, User, PostCreate, TagCreate, DictionaryItemCreate, ReactionSummary, UserReaction, CommentResponse } from "@/types";

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

  registerView: async (postId: string, token: string): Promise<void> => {
    await fetch(`${API_URL}/posts/${postId}/view`, {
      method: "POST",
      headers: getAuthHeaders(token),
    });
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

  toggleReaction: async (postId: string, type: string, token: string): Promise<UserReaction> => {
    const response = await fetch(`${API_URL}/posts/${postId}/reactions`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ type }),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao registrar reação");
    return response.json();
  },

  getReactionSummary: async (postId: string, token: string): Promise<ReactionSummary> => {
    const response = await fetch(`${API_URL}/posts/${postId}/reactions/summary`, {
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao buscar reações");
    return response.json();
  },

  checkReaction: async (postId: string, token: string): Promise<UserReaction> => {
    const response = await fetch(`${API_URL}/posts/${postId}/reactions/check`, {
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao verificar reação");
    return response.json();
  },

  createComment: async (postId: string, content: string, token: string): Promise<CommentResponse> => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ content }),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao enviar comentário");
    return response.json();
  },

  getMyComments: async (postId: string, token: string): Promise<CommentResponse[]> => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments/mine`, {
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao buscar seus comentários");
    return response.json();
  },

  getComments: async (postId: string, token: string): Promise<CommentResponse[]> => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      headers: getAuthHeaders(token),
    });
    checkAuth(response);
    if (!response.ok) throw new Error("Erro ao buscar comentários");
    return response.json();
  },

};
