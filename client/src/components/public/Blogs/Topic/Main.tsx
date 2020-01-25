import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { User } from '../../../../interfaces/user.interfaces';
import { Post } from '../../../../interfaces/post.interfaces';
import axios from 'axios';
import Blog from '../Blog';

type Props = {
  user?: User;
  topic: string;
};

const Main: React.FC<Props> = ({ user, topic }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (loaded === false) {
      getPosts();
      setLoaded(true);
    }
  }, []);

  const getPosts = async () => {
    const response = await axios.get(`/api/posts/?topic=${topic}`);
    setPosts(response.data);
  };

  return (
    <div className="container">
      {posts.map(post => (
        <div style={{ marginTop: '2rem' }}>
          <Blog
            description={post.description}
            id={String(post.id)}
            title={post.title}
            likes={post.likes}
          />
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Main);
