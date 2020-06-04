import axios from 'axios';
import { UserAction } from '../interfaces/user.interfaces';

const baseUrl: string = '/api/auth';

export const register = async (credentials: UserAction) => {
  const response = await axios.post(`${baseUrl}/register`, credentials);
  return response.data;
};

export const login = async (credentials: UserAction) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};
