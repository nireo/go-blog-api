import { SET_USER, CLEAR_USER, UserActionTypes } from "./types";
import { User } from "../../interfaces/user.interfaces";

export const clearUser = (): UserActionTypes => {
    return {
        type: CLEAR_USER
    };
};

export const setUser = (user: User): UserActionTypes => {
    return {
        type: SET_USER,
        payload: user
    };
};
