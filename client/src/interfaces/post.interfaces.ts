import { User } from "./user.interfaces";

export interface UpdatePost {
    text: string;
}

export interface CreatePost {
    text: string;
    description: string;
    title: string;
}

export interface Post {
    text: string;
    title: string;
    likes: number;
    user: User;
    id: number;
    description: string;
    created_at: string;
}
