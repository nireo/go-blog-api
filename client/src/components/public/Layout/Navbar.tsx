import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Misc/Modal';
import Register from '../User/Register';
import Login from '../User/Login';

const Navbar: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const hideModal = () => {
    setShow(false);
  };

  const showRegisterWindow = () => {
    setShowRegister(true);
  };

  const hideRegisterWindow = () => {
    setShowRegister(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <strong>gedium</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto"></ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/create"
                  style={{ color: 'black' }}
                >
                  Write
                </Link>
              </li>
              <li
                className="nav-item"
                style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
              >
                <Link
                  to="/blogs"
                  className="nav-link"
                  style={{ color: 'black' }}
                >
                  Browse
                </Link>
              </li>
              <button
                onClick={() => setShow(true)}
                className="nav-link link-styled-button"
                style={{ color: 'black' }}
              >
                Sign in
              </button>
            </ul>
          </div>
        </div>
      </nav>
      <Modal show={show} handleClose={hideModal}>
        <div className="container">
          {showRegister === true ? (
            <Register hideRegisterWindow={hideRegisterWindow} />
          ) : (
            <Login showRegisterWindow={showRegisterWindow} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
