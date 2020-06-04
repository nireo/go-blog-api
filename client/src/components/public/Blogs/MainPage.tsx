import React, { useEffect, useState } from 'react';
import { AppState } from '../../../store/index';
import { connect } from 'react-redux';
import { Post } from '../../../interfaces/post.interfaces';
import { initPosts } from '../../../store/posts/reducer';
import { Loading } from '../Misc/Loading';
import Blog from './Blog';
import Pagination from '../Layout/Pagination';

const mapStateToProps = (state: AppState) => ({
  posts: state.post,
});

type Props = {
  posts: Post[];
  initPosts: any;
};

const MainPage: React.FC<Props> = ({ posts, initPosts }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [amountInPage] = useState<number>(3);
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

  const lastPostIndex = currentPage * amountInPage;
  const firstPostIndex = lastPostIndex - amountInPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNum: number) => setCurrentPage(pageNum);

  return (
    <div className="mt-5 container">
      {currentPosts.map((post) => (
        <div key={`${post.id}`} style={{ marginBottom: '2rem' }}>
          <Blog
            id={String(post.id)}
            likes={post.likes}
            title={post.title}
            description={post.description}
            url={post.image_url}
          />
        </div>
      ))}
      <div className="container" style={{ paddingTop: '1rem' }}>
        <Pagination
          amountInPage={amountInPage}
          paginate={paginate}
          totalPosts={posts.length}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, { initPosts })(MainPage);
