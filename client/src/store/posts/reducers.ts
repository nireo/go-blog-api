import {
    PostState,
    PostActionTypes,
    INIT_POSTS,
    UPDATE_POST,
    REMOVE_POST,
    CREATE_POST
} from "./types";
import { Post } from "../../interfaces/post.interfaces";

const initialState: PostState = {
    posts: []
};

const postReducer = (
    state: PostState = initialState,
    action: PostActionTypes
): PostState => {
    switch (action.type) {
        case INIT_POSTS:
            return {
                posts: action.payload
            };
        case REMOVE_POST:
            const filteredPosts: Post[] = state.posts.filter(
                post => String(post.ID) !== action.id
            );
            return {
                posts: filteredPosts
            };
        case CREATE_POST:
            return {
                posts: [...state.posts, action.payload]
            };
        case UPDATE_POST:
            const updated: Post[] = state.posts.map(post =>
                String(post.ID) === action.id ? action.payload : post
            );
            return {
                posts: updated
            };
        default:
            return state;
    }
};

export default postReducer;
