import { Post } from "../../interfaces/post.interfaces";

export interface PostState {
    posts: Post[];
}

// define actions types
export const INIT_POSTS = "INIT_POSTS";
export const CREATE_POST = "CREATE_POST";
export const REMOVE_POST = "REMOVE_POST";
export const UPDATE_POST = "UPDATE_POSTS";

// define action interfaces
// temporarily using type any since not working properly
interface InitUserAction {
    type: typeof INIT_POSTS;
    payload: any;
}

interface CreatePostAction {
    type: typeof CREATE_POST;
    payload: any;
}

interface RemovePostAction {
    type: typeof REMOVE_POST;
    id: string;
}

interface UpdatePostAction {
    type: typeof UPDATE_POST;
    payload: any;
    id: string;
}

export type PostActionTypes =
    | UpdatePostAction
    | RemovePostAction
    | CreatePostAction
    | InitUserAction;
