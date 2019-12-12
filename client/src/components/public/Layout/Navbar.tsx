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
            gedium
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
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/create">
                  create
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/blogs" className="nav-link">
                  blogs
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li>
                <button
                  onClick={() => setShow(true)}
                  className="nav-link link-styled-button"
                >
                  login
                </button>
              </li>
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
