import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Misc/Modal';
import Register from '../User/Register';
import Login from '../User/Login';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { User } from '../../../interfaces/user.interfaces';

type Props = {
  user: User;
};

const Welcome: React.FC<Props> = ({ user }) => {
  return (
    <div className="container">
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
        {!user ? (
          <Link to="/register">
            <button className="text-3xl bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-24 rounded-full">
              Get started!
            </button>
          </Link>
        ) : (
          <Link to="/all">
            <button className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Read
            </button>
          </Link>
        )}
      </div>
      {!user && (
        <div style={{ marginTop: '1rem' }} className="text-center">
          Already have an account?{' '}
          <Link
            style={{ textDecoration: 'none' }}
            to="/login"
            className="text-blue-500 no-underline hover:text-blue-400"
          >
            Sign in!
          </Link>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(Welcome);
