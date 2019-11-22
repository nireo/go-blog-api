import { User, UserAction } from "../../interfaces/user.interfaces";
import { Dispatch } from "redux";
import UserService from "../../services/user.service";

const userService = new UserService();

const reducer = (state: User | null = null, action: any) => {
    switch (action.type) {
        case "LOGIN":
            return action.data;
        case "CLEAR_USER":
            return null;
        default:
            return state;
    }
};

export const clearUser = () => {
    return {
        type: "CLEAR_USER"
    };
};

export const login = (credentials: UserAction) => {
    return async (dispatch: Dispatch) => {
        const user = await userService.login(credentials);
        dispatch({
            type: "LOGIN",
            data: user
        });
    };
};

export const register = (credentials: UserAction) => {
    return async (dispatch: Dispatch) => {
        console.log(credentials);
        const user = await userService.register(credentials);
        dispatch({
            type: "LOGIN",
            data: user
        });
    };
};

export default reducer;
