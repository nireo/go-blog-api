import React, { useState, FormEvent, Dispatch } from 'react';
import { connect } from 'react-redux';
import { register } from '../../../store/user/reducer';
import { UserAction, User } from '../../../interfaces/user.interfaces';
import { AppState } from '../../../store';

type Props = {
  hideRegisterWindow: Dispatch<React.SetStateAction<boolean>>;
  register: (credentials: UserAction) => void;
  user: User;
};

const Register: React.FC<Props> = ({ hideRegisterWindow, register, user }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegistration = (event: FormEvent<HTMLFormElement>) => {
    // stop reloading site after submit
    event.preventDefault();
    const credentials: UserAction = {
      username,
      password
    };
    register(credentials);
  };

  if (user) {
    return (
      <div>
        <h2>You've already logged in.</h2>
        <p>You're already logged in, so no need to login again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h2>
          <strong>Register</strong>
        </h2>
      </div>
      <div className="container">
        <form className="form-signin" onSubmit={handleRegistration}>
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
              Register
            </button>
          </div>
        </form>
        <div className="text-center" style={{ marginTop: '1rem' }}>
          Already have an account?{' '}
          <button
            className="link-styled-button button-forms"
            onClick={() => hideRegisterWindow(true)}
          >
            Login.
          </button>
        </div>
      </div>
    </div>
  );
};

const mapState = (state: AppState) => ({
  user: state.user
});

export default connect(mapState, { register })(Register);
