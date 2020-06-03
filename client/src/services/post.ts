import axios from 'axios';
import { CreatePost } from '../interfaces/post.interfaces';
const baseUrl: string = '/api/posts';

let token: string | null = null;

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token,
  },
});

export const createPost = async (newPost: CreatePost) => {
  const response = await axios.post(`${baseUrl}`, newPost, getConfig());
  return response.data;
};
