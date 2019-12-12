import React from 'react';
import { Side } from './Side';

type Props = {
  topic: string;
};

export const TopicMain: React.FC<Props> = ({ topic }) => {
  return (
    <div className="container">
      <Side topic={topic} />
    </div>
  );
};
