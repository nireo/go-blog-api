import { User } from "../../interfaces/user.interfaces";

export interface UserState {
    user: null | User;
}

// define actions
export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

interface SetUserAction {
    type: typeof SET_USER;
    payload: User;
}

// we don't need to send any payload to clear user
interface ClearUserAction {
    type: typeof CLEAR_USER;
}

export type UserActionTypes = SetUserAction | ClearUserAction;
