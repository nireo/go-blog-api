import React, { useState, FormEvent, Dispatch } from 'react';
import { UserAction, User } from '../../../interfaces/user.interfaces';
import { login } from '../../../store/user/reducer';
import { connect } from 'react-redux';
import { AppState } from '../../../store';

type Props = {
  showRegisterWindow: Dispatch<React.SetStateAction<boolean>>;
  login: (credentials: UserAction) => void;
  user: User;
};

const Login: React.FC<Props> = ({ showRegisterWindow, login, user }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    // prevent reload
    event.preventDefault();
    const credentials: UserAction = {
      username,
      password
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
    <div>
      <div className="text-center">
        <h2>
          <strong>Login</strong>
        </h2>
      </div>
      <div className="container">
        <form className="form-signin" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              style={{ width: '100%', display: 'inline-block' }}
              type="text"
              className="form-control"
              placeholder="Username"
              required
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className="form-group">
            <input
              style={{ width: '100%', display: 'inline-block' }}
              type="password"
              className="form-control"
              placeholder="Password"
              required
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <div style={{ marginTop: '3rem' }}>
            <button
              type="submit"
              className="get-started-button-big"
              style={{ width: '100%' }}
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center" style={{ marginTop: '1rem' }}>
          Don't have an account?{' '}
          <button
            className="link-styled-button button-forms"
            onClick={() => showRegisterWindow(true)}
          >
            Register.
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { login })(Login);
