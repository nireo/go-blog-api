import React, { useState, useEffect } from 'react';
import topicsJSON from '../../../../topic.json';
import { Loading } from '../../Misc/Loading';
import { NotFound } from '../../Misc/NotFound';

type Props = {
  topic: string;
};

// shorthand is the link name we can get as parameter to display the right type
interface TopicInfo {
  shorthand: string;
  name: string;
  desc: string;
}

interface Topics {
  topics: TopicInfo[];
}

export const Side: React.FC<Props> = ({ topic }) => {
  // all topic descriptions and names are in the topic.json file.
  const [topics] = useState<any>(topicsJSON);
  const [searched, setSearched] = useState<boolean>(false);
  const [foundTopic, setFoundTopic] = useState<TopicInfo | null>(null);

  useEffect(() => {
    if (searched === false && foundTopic === null) {
      if (topics !== undefined) {
        setFoundTopic(
          topics.topics.find((t: TopicInfo) => t.shorthand === topic)
        );
        setSearched(true);
      }
      setSearched(true);
    }
  }, [topics, topic, foundTopic, searched, setSearched, setFoundTopic]);

  if (searched === false && foundTopic === null) {
    return (
      <div className="container text-center" style={{ marginTop: '4rem' }}>
        <Loading />
      </div>
    );
  }

  if (searched === true && foundTopic === null) {
    return <NotFound />;
  }

  return (
    <div>
      {foundTopic !== null && (
        <div>
          <h3 className="text-blue-500 text-2xl font-mono mb-2">
            <strong>{foundTopic.name}</strong>
          </h3>
          <p>{foundTopic.desc}</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Follow
          </button>
        </div>
      )}
    </div>
  );
};
