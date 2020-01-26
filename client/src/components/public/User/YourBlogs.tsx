import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/index';
import { User } from '../../../interfaces/user.interfaces';
import { Post } from '../../../interfaces/post.interfaces';
import axios from 'axios';
import { Loading } from '../Misc/Loading';
import Blog from '../Blogs/Blog';

type Props = {
  user: User;
};

const YourBlogs: React.FC<Props> = ({ user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<Post[]>([]);

  useEffect(() => {
    if (loaded === false && blogs === [] && !user) {
      getBlogs();
      setLoaded(true);
    }
  }, []);

  if (!user) {
    return <div></div>;
  }

  if (!loaded) {
    return <Loading />;
  }

  const getBlogs = async () => {
    const response = await axios.get('/api/posts/your-blogs');
    setBlogs(response.data);
  };

  return (
    <div className="container">
      {blogs.map((blog: Post) => (
        <div className="row">
          <div className="col-md-9">
            <Blog
              likes={blog.likes}
              title={blog.title}
              description={blog.description}
              id={String(blog.id)}
            />
          </div>
          <div className="col-md-3">
            <button className="button-smaller">Delete</button>
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, {})(YourBlogs);
