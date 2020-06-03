import { UserToken } from './../../interfaces/user.interfaces';
import { User, UserAction } from '../../interfaces/user.interfaces';
import { Dispatch } from 'redux';
import UserService from '../../services/user.service';
import BaseService from '../../services/base.service';
import { setTokens } from '../../utils/setTokens';

const userService = new UserService();
const baseService = new BaseService();

const reducer = (state: User | null = null, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return action.data;
    case 'CLEAR_USER':
      return null;
    default:
      return state;
  }
};

export const clearUser = () => {
  return {
    type: 'CLEAR_USER',
  };
};

export const login = (credentials: UserAction) => {
  return async (dispatch: Dispatch) => {
    const user: UserToken = await userService.login(credentials);
    window.localStorage.setItem('user', JSON.stringify(user));
    setTokens(user.token);
    dispatch({
      type: 'LOGIN',
      data: user.user,
    });
  };
};

export const checkLocalStorage = () => {
  return async (dispatch: Dispatch) => {
    const userInfo: string | null = localStorage.getItem('user');
    // check if there is an actual value
    if (userInfo) {
      const userInfoJSON: UserToken = JSON.parse(userInfo);
      baseService.saveToken(userInfoJSON.token);
      dispatch({
        type: 'LOGIN',
        data: userInfoJSON.user,
      });
    }
  };
};

export const register = (credentials: UserAction) => {
  return async (dispatch: Dispatch) => {
    const user: UserToken = await userService.register(credentials);
    baseService.saveToken(user.token);
    dispatch({
      type: 'LOGIN',
      data: user.user,
    });
  };
};

export default reducer;
