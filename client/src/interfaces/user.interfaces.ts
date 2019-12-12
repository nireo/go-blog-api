export interface UserAction {
  username: string;
  password: string;
}

export interface User {
  username: string;
  id: number;
}

export interface UserToken {
  token: string;
  user: User;
}
