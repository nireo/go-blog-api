import React from 'react';
import { Topic } from '../../../../interfaces/topic.interfaces';

type Props = {
  topic: Topic;
};

export const Side: React.FC<Props> = ({ topic }) => {
  return (
    <div>
      <div>
        <h3 className="text-blue-500 text-2xl font-mono">
          <strong>{topic.title}</strong>
        </h3>
        <p className="text-gray-600 mb-2">{topic.description}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Follow
        </button>
      </div>
    </div>
  );
};
