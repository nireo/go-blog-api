import React from 'react';
import { TopicWithPosts } from '../../../../interfaces/topic.interfaces';
import { Latest } from './Latest';
import { MostPopular } from './MostPopular';

type Props = {
  topic: TopicWithPosts;
};

const Main: React.FC<Props> = ({ topic }) => {
  return (
    <div className="container">
      <h2 className="font-mono text-blue-500">Latest</h2>
      <Latest topic={topic} />
      <hr className="my-10"></hr>

      <h2 className="font-mono text-blue-500">Most popular</h2>
      <MostPopular topic={topic} />
    </div>
  );
};

export default Main;
