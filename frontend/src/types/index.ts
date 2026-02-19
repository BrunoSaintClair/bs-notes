export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: Tag[];
  date: string;
}

export interface DictionaryItem {
  id: string;
  term: string;
  definition: string;
  letter: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface PostCreate {
  title: string;
  description: string;
  image: string;
  date: string;
  tag_ids: string[];
}

export interface DictionaryItemCreate {
  term: string;
  definition: string;
  letter: string;
}

export interface TagCreate {
  name: string;
}
