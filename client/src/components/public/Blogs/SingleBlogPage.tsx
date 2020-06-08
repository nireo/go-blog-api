import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { getPostById, updatePost } from '../../../store/posts/reducer';
import { Post } from '../../../interfaces/post.interfaces';
import { Loading } from '../Misc/Loading';

type Props = {
  id: string;
  posts: Post[];
  getPostById: (id: string) => Promise<void>;
  updatePost: (post: Post, id: string) => Promise<void>;
};

const mapStateToProps = (state: AppState) => ({
  posts: state.post,
});

const SingleBlogPage: React.FC<Props> = ({
  id,
  posts,
  getPostById,
  updatePost,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [post, setPost] = useState<undefined | Post>(undefined);

  useEffect(() => {
    if (loaded === false) {
      const checkForPost = posts.find((post) => String(post.id) === id);
      if (checkForPost) {
        setPost(checkForPost);
      } else {
        getPostById(id).then(() => {
          const singlePost = posts.find((post) => String(post.id) === id);
          setPost(singlePost);
        });
      }
      setLoaded(false);
    }
  }, [id, loaded, setLoaded, posts, getPostById]);

  if (loaded === false && post === undefined) {
    return <Loading />;
  }

  if (loaded === true && post === undefined) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Not found.</h2>
        <p>The post you're searching for hasn't been found.</p>
      </div>
    );
  }

  //const addLike = (event: FormEvent<HTMLFormElement>) => {
  //  // prevent site from reloading when submitting.
  //  event.preventDefault();
  //  if (!post) {
  //    // not necessary, but typescript complains
  //    return;
  //  }
  //
  //  const postWithLike = { ...post, likes: post.likes + 1 };
  //  updatePost(postWithLike, String(post.id));
  //};

  const returnSensibleDate = (dateString: string) => {
    const date = new Date(dateString);
    var monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  };

  return (
    <div className="container mt-4">
      {post !== undefined && (
        <div>
          <div className="text-center">
            <h2 style={{ fontSize: '36px' }}>
              <strong>{post.title}</strong>
            </h2>
            <h6 className="text-muted" style={{ fontSize: '20px' }}>
              {post.description}
            </h6>
          </div>
          <div style={{ marginLeft: '20%' }}>
            <p style={{ marginBottom: '0' }}>{post.user.username}</p>
            <p className="text-muted">{returnSensibleDate(post.created_at)}</p>
          </div>
          <div className="text-center">
            <img alt="post" src={post.image_url} style={{ width: '50rem' }} />
          </div>
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <hr />
              <p style={{ fontSize: '18px' }}>{post.text}</p>
              <hr />
            </div>
            <div className="col-md-2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, { getPostById, updatePost })(
  SingleBlogPage
);
