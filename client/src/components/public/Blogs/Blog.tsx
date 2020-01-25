import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  description: string;
  id: string;
  title: string;
  likes: number;
  url?: string;
};

const Blog: React.FC<Props> = ({ description, id, title, likes, url }) => {
  console.log(url);
  return (
    <div className="row">
      <div className="col-md-2">
        <img src={url} style={{ width: '6rem' }} />
      </div>
      <div className="col-md-10">
        <Link
          to={`/blog/${id}`}
          style={{
            textDecoration: 'none',
            color: 'black',
            paddingBottom: 0,
            marginBottom: 0
          }}
        >
          <h3>
            <strong>{title}</strong>
          </h3>
        </Link>
        <p style={{ margin: 0, padding: 0, fontSize: '15px' }}>{description}</p>
      </div>
    </div>
  );
};

export default Blog;
