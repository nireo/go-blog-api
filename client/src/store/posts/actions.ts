import {
  INIT_POSTS,
  CREATE_POST,
  REMOVE_POST,
  UPDATE_POST,
  PostActionTypes,
} from './types';
import { Post, CreatePost, UpdatePost } from '../../interfaces/post.interfaces';
import { Dispatch } from 'redux';

export const initPosts = async (): Promise<PostActionTypes> => {
  const posts = await postService.getPosts();
  return {
    type: INIT_POSTS,
    payload: posts,
  };
};

export const createPost = async (
  post: CreatePost
): Promise<PostActionTypes> => {
  const newPost = await postService.createPost(post);
  return {
    type: CREATE_POST,
    payload: newPost,
  };
};

export const updatePost = async (
  post: Post,
  id: string
): Promise<PostActionTypes> => {
  const updatedPost = await postService.updatePost(post, id);
  return {
    type: UPDATE_POST,
    payload: updatedPost,
    id: id,
  };
};

export const removePost = async (id: string): Promise<PostActionTypes> => {
  await postService.removePost(id);
  return {
    type: REMOVE_POST,
    id: id,
  };
};
