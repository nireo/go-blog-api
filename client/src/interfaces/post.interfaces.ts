import { User } from "./user.interfaces";

export interface UpdatePost {
    text: string;
}

export interface CreatePost {
    text: string;
}

export interface Post {
    text: string;
    title: string;
    likes: number;
    user: User;
    id: number;
    description: string;
}
