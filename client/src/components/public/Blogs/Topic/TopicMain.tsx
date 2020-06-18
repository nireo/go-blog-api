import React, { useState, useEffect, useCallback } from 'react';
import { Side } from './Side';
import Main from './Main';
import { TopicWithPosts } from '../../../../interfaces/topic.interfaces';
import { getSingleTopic } from '../../../../services/topic';
import { Loading } from '../../Misc/Loading';
import { Link } from 'react-router-dom';

type Props = {
  id: string;
};

const TopicMain: React.FC<Props> = ({ id }) => {
  const [mainTopic, setMainTopic] = useState<TopicWithPosts | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const loadTopic = useCallback(async () => {
    const data = await getSingleTopic(id);
    setMainTopic(data);
  }, [id]);

  useEffect(() => {
    if (mainTopic === null && loaded === false) {
      loadTopic();
      setLoaded(true);
    }
  }, [setLoaded, mainTopic, loadTopic, loaded]);

  return (
    <div className="container">
      {mainTopic === null && loaded === false && (
        <div className="mt-8" style={{ textAlign: 'center' }}>
          <Loading />
        </div>
      )}
      {mainTopic === null && loaded === true && (
        <div className="mt-8">
          <h3 className="font-mono text-3xl text-blue-500">Not found</h3>
          <p className="text-gray-600">
            The topic you're looking for has not been found. If this topic
            interests you consider creating an entry for that topic!
          </p>
          <Link to="/create/topic">
            <button className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create topic
            </button>
          </Link>
        </div>
      )}
      {mainTopic !== null && (
        <div className="row" style={{ marginTop: '2rem' }}>
          <div className="col-md-9">
            <Main topic={mainTopic} />
          </div>
          <div className="col-md-3">
            <Side topic={mainTopic.topic} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicMain;
