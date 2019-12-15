import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Misc/Modal';
import Register from '../User/Register';
import Login from '../User/Login';

export const Welcome: React.FC = () => {
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
    <div className="container">
      <Modal show={show} handleClose={hideModal}>
        <div className="container">
          {showRegister === true ? (
            <Register hideRegisterWindow={hideRegisterWindow} />
          ) : (
            <Login showRegisterWindow={setShowRegister} />
          )}
        </div>
      </Modal>
      <h1
        className="text-center"
        style={{ fontSize: '80px', marginTop: '4rem' }}
      >
        <strong>Read about things that you care about.</strong>
      </h1>
      <h6 className="text-center" style={{ marginTop: '2rem' }}>
        <strong>Select what you're into.</strong>
      </h6>
      <div style={{ marginTop: '2rem' }}>
        <Link
          to="/topic/programming"
          className="display-tag"
          style={{ textDecoration: 'none' }}
        >
          Programming
        </Link>
        <Link
          to="/topic/ai"
          className="display-tag"
          style={{ textDecoration: 'none' }}
        >
          Artificial Intelligence
        </Link>
        <Link
          to="/topic/technology"
          className="display-tag"
          style={{ textDecoration: 'none' }}
        >
          Technology
        </Link>
        <Link
          to="/topic/fitness"
          className="display-tag"
          style={{ textDecoration: 'none' }}
        >
          Fitness
        </Link>
        <Link
          to="/topic/self-improvement"
          className="display-tag"
          style={{ textDecoration: 'none' }}
        >
          Self Improvement
        </Link>
      </div>
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <button
          onClick={() => setShow(true)}
          className="get-started-button-big"
        >
          Get started
        </button>
      </div>
      <div style={{ marginTop: '1rem' }} className="text-center">
        Already have an account?{' '}
        <button onClick={() => setShow(true)} className="link-styled-button">
          Sign in.
        </button>
      </div>
    </div>
  );
};
