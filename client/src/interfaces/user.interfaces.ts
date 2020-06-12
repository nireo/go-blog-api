export interface UserAction {
  username: string;
  password: string;
}

export interface User {
  username: string;
  uuid: string;
  url: string;
  created: string;
}

export interface UserToken {
  token: string;
  user: User;
}
