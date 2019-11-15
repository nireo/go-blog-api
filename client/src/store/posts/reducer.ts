import { Dispatch } from "redux";
import PostService from "../../services/post.service";
import { Post, UpdatePost, CreatePost } from "../../interfaces/post.interfaces";

const postService = new PostService();

const reducer = (state: Post[] = [], action: any) => {
    switch (action.type) {
        case "INIT_POSTS":
            return action.data;
        case "CLEAR_POSTS":
            return action.data;
        case "CREATE_POST":
            return [...state, action.data];
        case "REMOVE_POST":
            return state.filter(post => String(post.ID) === action.id);
        case "UPDATE_POST":
            return state.map(post =>
                String(post.ID) === action.id ? action.data : post
            );
        default:
            return state;
    }
};

export const initPosts = async () => {
    return async (dispatch: Dispatch) => {
        const posts = await postService.getPosts();
        dispatch({
            type: "INIT_POSTS",
            data: posts
        });
    };
};

export const createPost = async (post: CreatePost) => {
    return async (dispatch: Dispatch) => {
        const newPost = await postService.createPost(post);
        dispatch({
            type: "CREATE_POST",
            data: newPost
        });
    };
};

export const updatePost = async (post: UpdatePost, id: string) => {
    return async (dispatch: Dispatch) => {
        const updatedPost = await postService.updatePost(post, id);
        dispatch({
            type: "UPDATE_POST",
            data: updatePost,
            id: id
        });
    };
};

export const removePost = async (id: string) => {
    return async (dispatch: Dispatch) => {
        await postService.removePost(id);
        dispatch({
            type: "REMOVE_POST",
            id: id
        });
    };
};

export default reducer;
