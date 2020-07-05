import axios from 'axios';
import { CreatePost, Post, CreateNewPost } from '../interfaces/post.interfaces';
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

export const createPost = async (newPost: CreateNewPost) => {
  const response = await axios.post(`${baseUrl}`, newPost, getConfig());
  return response.data;
};

export const updatePost = async (updated: Post, id: string) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updated, getConfig());
  return response.data;
};

export const getPostById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/single/${id}`, getConfig());
  return response.data;
};

export const getPosts = async () => {
  const response = await axios.get(baseUrl, getConfig());
  return response.data;
};

export const removePost = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  return response.data;
};

export const getDashboardData = async () => {
  const response = await axios.get(`${baseUrl}/dashboard`, getConfig());
  return response.data;
};

export const searchPost = async (search: string) => {
  const response = await axios.get(`${baseUrl}/search/${search}`);
  return response.data;
};

export const likePost = async (id: string) => {
  const response = await axios.post(`${baseUrl}/like/${id}`, getConfig());
  return response.data;
};
