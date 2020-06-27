import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { User } from '../../../interfaces/user.interfaces';
import { Redirect } from 'react-router-dom';
import { Topic } from '../../../interfaces/topic.interfaces';
import { Post } from '../../../interfaces/post.interfaces';
import { getDashboardData } from '../../../services/post';
import Blog from '../Blogs/Blog';
import { deleteTopicAction } from '../../../store/topics/reducer';
import { setNotification } from '../../../store/notification/reducer';
import { Notification } from '../../../interfaces/notification.interfaces';

type Props = {
  user: User | null;
  deleteTopicAction: (id: string) => void;
  setNotification: (newNotification: Notification, duration: number) => void;
};

const Dashboard: React.FC<Props> = ({
  user,
  setNotification,
  deleteTopicAction,
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    const data = await getDashboardData();
    setTopics(data.topics);
    setPosts(data.posts);
  }, []);

  useEffect(() => {
    if (!loaded) {
      loadData();
      setLoaded(true);
    }
  }, []);

  if (user === null) {
    return <Redirect to="/" />;
  }

  const handleTopicDeletion = (topicID: string) => {
    deleteTopicAction(topicID);
    setNotification(
      { type: 'success', content: 'Successfully removed topic!' },
      3
    );
  };

  return (
    <div className="container">
      <h3 className="text-4xl mt-6 font-mono text-blue-500">
        Welcome {user.username}
      </h3>
      <p className="text-gray-600">
        Here you can manage topics and the posts you've created.
      </p>
      <hr className="mt-4 mb-4"></hr>
      <h4 className="text-3xl font-mono text-blue-500">Your topics</h4>
      {topics.map((topic: Topic) => (
        <div className="shadow-md w-full py-4 px-4 rounded mb-4">
          <h4 className="text-xl text-blue-500 font-mono">{topic.title}</h4>
          <p className="text-gray-600">{topic.description}</p>
          <button
            onClick={() => handleTopicDeletion(topic.uuid)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm mt-2 rounded"
          >
            Create topic
          </button>
        </div>
      ))}
      <hr className="mt-4 mb-4"></hr>
      <h4 className="text-3xl font-mono text-blue-500">Your posts</h4>
      {posts.map((post: Post) => (
        <div className="mt-2 mb-2">
          <Blog
            id={String(post.id)}
            likes={post.likes}
            title={post.title}
            description={post.description}
            url={post.image_url}
            uuid={post.uuid}
            created={post.created_at}
          />
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps, { setNotification, deleteTopicAction })(
  Dashboard
);
