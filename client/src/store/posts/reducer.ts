import { Dispatch } from 'redux';
import { Post, CreatePost } from '../../interfaces/post.interfaces';
import {
  createPost as serviceCreatePost,
  getPosts as serviceGetPosts,
  getPostById as serviceGetPostById,
  updatePost as serviceUpdatePost,
  removePost as serviceRemovePost,
} from '../../services/post';

const reducer = (state: Post[] = [], action: any) => {
  switch (action.type) {
    case 'INIT_POSTS':
      return action.data;
    case 'CLEAR_POSTS':
      return [];
    case 'CREATE_POST':
      return [...state, action.data];
    case 'REMOVE_POST':
      return state.filter((post) => String(post.id) === action.id);
    case 'UPDATE_POST':
      return state.map((post) =>
        String(post.id) === action.id ? action.data : post
      );
    default:
      return state;
  }
};

export const initPosts = () => {
  return async (dispatch: Dispatch) => {
    const posts = await serviceGetPosts();
    dispatch({
      type: 'INIT_POSTS',
      data: posts,
    });
  };
};

export const getPostById = (id: string) => {
  return async (dispatch: Dispatch) => {
    const post = await serviceGetPostById(id);
    dispatch({
      type: 'CREATE_POST',
      data: post,
    });
  };
};

export const createPost = (post: CreatePost) => {
  return async (dispatch: Dispatch) => {
    const newPost = await serviceCreatePost(post);
    dispatch({
      type: 'CREATE_POST',
      data: newPost,
    });
  };
};

export const updatePost = (post: Post, id: string) => {
  return async (dispatch: Dispatch) => {
    const updatedPost = await serviceUpdatePost(post, id);
    dispatch({
      type: 'UPDATE_POST',
      data: updatedPost,
      id: id,
    });
  };
};

export const removePost = (id: string) => {
  return async (dispatch: Dispatch) => {
    await serviceRemovePost(id);
    dispatch({
      type: 'REMOVE_POST',
      id: id,
    });
  };
};

export default reducer;
