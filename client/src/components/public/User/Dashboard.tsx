import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { User } from '../../../interfaces/user.interfaces';
import { Redirect } from 'react-router-dom';
import { Topic } from '../../../interfaces/topic.interfaces';
import { Post } from '../../../interfaces/post.interfaces';

type Props = {
  user: User | null;
};

const Dashboard: React.FC<Props> = ({ user }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  if (user === null) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <h3 className="text-4xl mt-6 font-mono text-blue-500">
        Welcome {user.username}
      </h3>
      <p className="text-gray-600">
        Here you can manage topics and the posts you've created.
      </p>
      <hr className="mt-4 mb-4"></hr>
      <h4 className="text-3xl">Your topics</h4>
      {topics.map((topic: Topic) => (
        <div></div>
      ))}
      <hr className="mt-4 mb-4"></hr>
      <h4 className="text-3xl">Your posts</h4>
      {posts.map((post: Post) => (
        <div></div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Dashboard);
