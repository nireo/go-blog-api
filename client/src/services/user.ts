import axios from 'axios';
import { UserAction } from '../interfaces/user.interfaces';

const baseUrl: string = '/api/auth';
let token: null | string = null;

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token,
  },
});

export const register = async (credentials: UserAction) => {
  const response = await axios.post(`${baseUrl}/register`, credentials);
  return response.data;
};

export const login = async (credentials: UserAction) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

export const followUser = async (username: string) => {
  const response = await axios.post(
    `${baseUrl}/follow${username}`,
    getConfig()
  );
  return response.data;
};
