import React from 'react';
import { Link } from 'react-router-dom';

export const Welcome: React.FC = () => {
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
        <button className="get-started-button-big">Get started</button>
      </div>
      <div style={{ marginTop: '1rem' }} className="text-center">
        Already have an account?{' '}
        <button className="link-styled-button">Sign in.</button>
      </div>
    </div>
  );
};
