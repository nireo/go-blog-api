import { User } from './user.interfaces';

export interface UpdatePost {
  text: string;
}

export interface CreatePost {
  text: string;
  description: string;
  title: string;
}

export interface CreateNewPost {
  title: string;
  description: string;
  imageURL: string;
  topic: string;
  paragraphs: ParagraphAction[];
}

export interface ParagraphAction {
  type: string;
  content: string;
}

export interface Post {
  text: string;
  title: string;
  likes: number;
  user: User;
  id: number;
  description: string;
  created_at: string;
  image_url?: string;
  uuid: string;
}
