import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/index';
import { Topic } from '../../../interfaces/topic.interfaces';
import { getTopicsAction } from '../../../store/topics/reducer';
import { Link } from 'react-router-dom';

type Props = {
  topics: Topic[];
  getTopicsAction: () => Promise<void>;
};

const TopicBrowser: React.FC<Props> = ({ topics, getTopicsAction }) => {
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (topics.length === 0) {
      getTopicsAction();
    }
  }, []);

  const filteredTopics = topics.filter((topic: Topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h3 className="text-3xl">Choose a topic</h3>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
        value={search}
        placeholder="Search for topic"
        onChange={({ target }) => setSearch(target.value)}
      />
      {filteredTopics.map((topic: Topic) => (
        <Link to={`/topic/${topic.url}`}>
          <button className="text-blue-500 bg-gray-200 py-3 hover:text-gray-200 hover:bg-blue-500 font-bold w-full">
            {topic.title}
          </button>
        </Link>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  topics: state.topic,
});

export default connect(mapStateToProps, { getTopicsAction })(TopicBrowser);
