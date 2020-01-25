import React, { useEffect, useState } from 'react';
import { AppState } from '../../../store/index';
import { connect } from 'react-redux';
import { Post } from '../../../interfaces/post.interfaces';
import { initPosts } from '../../../store/posts/reducer';
import { Loading } from '../Misc/Loading';
import Blog from './Blog';

const mapStateToProps = (state: AppState) => ({
  posts: state.post
});

type Props = {
  posts: Post[];
  initPosts: any;
};

const MainPage: React.FC<Props> = ({ posts, initPosts }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (posts.length < 1 && loaded === false) {
      // added loaded since it continues requesting after first request
      // if there is no posts.
      initPosts();
      setLoaded(true);
    }
  }, [posts, initPosts, loaded]);

  if (posts.length === 0) {
    return <Loading />;
  }
  console.log(posts);

  return (
    <div className="container mt-4">
      {posts.map(post => (
        <div key={`${post.id}`}>
          <Blog
            id={String(post.id)}
            likes={post.likes}
            title={post.title}
            description={post.description}
          />
        </div>
      ))}
    </div>
  );
};

export default connect(mapStateToProps, { initPosts })(MainPage);
