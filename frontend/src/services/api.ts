import type { Post, Tag, DictionaryItem, User } from "../types";

const API_URL = import.meta.env.API_URL || "http://localhost:8000";

export const api = {
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts/?limit=100`);
    if (!response.ok) throw new Error("Erro buscando posts");
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

  loginGoogle: async (token: string): Promise<User> => {
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
  }

};
