import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../../interfaces/user.interfaces';
import axios from 'axios';
import formatDate from '../../../utils/formatData';
import { Post } from '../../../interfaces/post.interfaces';
import { followUser } from '../../../services/user';
import Blog from '../Blogs/Blog';
import { stringify } from 'querystring';

type Props = {
  id: string;
};

export const SingleUser: React.FC<Props> = ({ id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  const loadUser = useCallback(async () => {
    const response = await axios.get(`/api/auth/single/${id}`);
    setUser(response.data.user);
    setPosts(response.data.posts);
  }, [id]);

  useEffect(() => {
    if (user === null) {
      loadUser();
    }
  }, [loadUser, user]);

  const handleUserFollow = () => {
    if (!user) {
      return;
    }
    followUser(user.username);
  };

  return (
    <div className="container mt-8">
      {user === null && <div className="text-center">Loading...</div>}
      {user !== null && (
        <div>
          <h2 className="text-3xl">{user.username}</h2>
          <h2 className="text-gray-600 text-sm">
            Signed up: {formatDate(user.created)}
          </h2>
          <button
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => handleUserFollow()}
          >
            Follow
          </button>
          <hr className="mt-6 mb-6"></hr>
          <h3 className="text-2xl">Posts</h3>
          {posts?.length === 0 ? (
            <div>
              <p className="text-gray-600">User has no published posts.</p>
            </div>
          ) : (
            <div>
              {posts?.map((post: Post) => (
                <Blog
                  id={String(post.id)}
                  likes={post.likes}
                  title={post.title}
                  description={post.description}
                  url={post.image_url}
                  uuid={post.uuid}
                  created={post.created_at}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
