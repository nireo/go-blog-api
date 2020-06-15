import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { User } from '../../../../interfaces/user.interfaces';
import { Post } from '../../../../interfaces/post.interfaces';
import axios from 'axios';
import Blog from '../Blog';
import { Loading } from '../../Misc/Loading';

type Props = {
  user?: User;
  topic: string;
};

const Main: React.FC<Props> = ({ user, topic }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const getPosts = useCallback(async () => {
    const response = await axios.get(`/api/posts/?topic=${topic}`);
    setPosts(response.data);
  }, [topic]);

  useEffect(() => {
    if (loaded === false) {
      getPosts();
      setLoaded(true);
    }
  }, [getPosts, loaded]);

  return (
    <div className="container">
      {loaded === false ? (
        <Loading />
      ) : (
        <div>
          {posts.map((post) => (
            <div style={{ marginTop: '2rem' }}>
              <Blog
                description={post.description}
                id={String(post.id)}
                title={post.title}
                likes={post.likes}
                uuid={post.uuid}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Main);
