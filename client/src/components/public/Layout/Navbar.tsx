import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { User } from '../../../interfaces/user.interfaces';
import { clearUser } from '../../../store/user/reducer';

type Props = {
  user: User;
  clearUser: () => void;
};

const Navbar: React.FC<Props> = ({ user, clearUser }) => {
  const handleSignOut = () => {
    clearUser();
    localStorage.clear();
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">gedium</span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className="w-full block flex-grow lg:flex lg:items-center lg:w-auto"
        style={{ margin: 0 }}
      >
        <div className="text-sm lg:flex-grow">
          <Link
            to="/all"
            className="block lg:inline-block text-teal-200 hover:text-white mr-4"
            style={{ textDecoration: 'none' }}
          >
            Read
          </Link>
          {user !== null && (
            <Link
              to="/write"
              className="block lg:inline-block text-teal-200 hover:text-white mr-4"
              style={{ textDecoration: 'none' }}
            >
              Write
            </Link>
          )}
          <Link
            to="/about"
            className="block lg:inline-block text-teal-200 hover:text-white mr-4"
            style={{ textDecoration: 'none' }}
          >
            About
          </Link>
          <Link
            to="/search"
            className="block lg:inline-block text-teal-200 hover:text-white mr-4"
            style={{ textDecoration: 'none' }}
          >
            Search
          </Link>
          {user !== null && (
            <Link
              to="/dashboard"
              className="block lg:inline-block text-teal-200 hover:text-white mr-4"
              style={{ textDecoration: 'none' }}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div>
          {user == null ? (
            <Link
              to="/login"
              className="inline-block hover:text-blue-500 text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent text-white"
              style={{ textDecoration: 'none' }}
            >
              Login
            </Link>
          ) : (
            <button
              className="inline-block hover:text-blue-500 text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent text-white"
              style={{ textDecoration: 'none' }}
              onClick={() => handleSignOut()}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps, { clearUser })(Navbar);
