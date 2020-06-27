import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { User } from '../../../interfaces/user.interfaces';
import { Topic } from '../../../interfaces/topic.interfaces';
import { getTopicsAction } from '../../../store/topics/reducer';

type Props = {
  user: User;
  topics: Topic[];
  getTopicsAction: () => Promise<void>;
};

const Welcome: React.FC<Props> = ({ user, topics, getTopicsAction }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (topics.length === 0 && !loaded) {
      getTopicsAction();
      setLoaded(true);
    }
  }, [loaded, setLoaded, topics.length, getTopicsAction]);

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
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        {topics.map((topic: Topic) => (
          <Link
            key={topic.uuid}
            to={`/topic/${topic.url}`}
            className="display-tag"
            style={{ textDecoration: 'none' }}
          >
            {topic.title}
          </Link>
        ))}
        {user !== null && (
          <Link
            className="display-tag"
            style={{ textDecoration: 'none' }}
            to="/create"
          >
            Create New topic +
          </Link>
        )}
      </div>
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        {!user ? (
          <Link to="/register">
            <button className="text-3xl bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-24 rounded-full">
              Get started!
            </button>
          </Link>
        ) : (
          <Link to="/read">
            <button className="text-3xl bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-20 rounded-full">
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
  topics: state.topic,
});

export default connect(mapStateToProps, { getTopicsAction })(Welcome);
