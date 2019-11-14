import { UserState, UserActionTypes, SET_USER, CLEAR_USER } from "./types";

const initialState: UserState = {
    user: null
};

export const userReducer = (
    state: UserState = initialState,
    action: UserActionTypes
): UserState => {
    switch (action.type) {
        case SET_USER:
            return {
                user: action.payload
            };
        case CLEAR_USER:
            return {
                user: null
            };
        default:
            return state;
    }
};
