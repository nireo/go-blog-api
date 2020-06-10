import React, { useState, FormEvent, Dispatch } from 'react';
import { UserAction, User } from '../../../interfaces/user.interfaces';
import { login } from '../../../store/user/reducer';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { Link } from 'react-router-dom';

type Props = {
  login: (credentials: UserAction) => void;
  user: User;
};

const Login: React.FC<Props> = ({ login, user }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    // prevent reload
    event.preventDefault();
    const credentials: UserAction = {
      username,
      password,
    };
    login(credentials);
  };

  if (user) {
    return (
      <div>
        <h2>You're already logged in.</h2>
        <p>You have already logged in, so you don't need to do it again.</p>
      </div>
    );
  }

  return (
    <div style={{ margin: 'auto', width: '50%', marginTop: '6rem' }}>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/register"
          >
            Don't have an account
          </Link>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 nireo. All rights reserved.
      </p>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps, { login })(Login);
