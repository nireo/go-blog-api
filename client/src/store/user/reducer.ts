import { UserToken } from './../../interfaces/user.interfaces';
import { User, UserAction } from '../../interfaces/user.interfaces';
import { Dispatch } from 'redux';
import { setTokens } from '../../utils/setTokens';
import {
  login as serviceLogin,
  register as serviceRegister,
} from '../../services/user';

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
    const user: UserToken = await serviceLogin(credentials);
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
      setTokens(userInfoJSON.token);
      dispatch({
        type: 'LOGIN',
        data: userInfoJSON.user,
      });
    }
  };
};

export const register = (credentials: UserAction) => {
  return async (dispatch: Dispatch) => {
    const user: UserToken = await serviceRegister(credentials);
    setTokens(user.token);
    dispatch({
      type: 'LOGIN',
      data: user.user,
    });
  };
};

export default reducer;
