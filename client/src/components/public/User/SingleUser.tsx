import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../../interfaces/user.interfaces';
import axios from 'axios';
import formatDate from '../../../utils/formatData';
import { Post } from '../../../interfaces/post.interfaces';
import { followUser, unfollowUser } from '../../../services/user';
import Blog from '../Blogs/Blog';
import { setNotification } from '../../../store/notification/reducer';
import { connect } from 'react-redux';
import { Notification } from '../../../interfaces/notification.interfaces';

type Props = {
  id: string;
  setNotification: (newNotification: Notification, duration: number) => void;
};

const SingleUser: React.FC<Props> = ({ id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const loadUser = useCallback(async () => {
    const response = await axios.get(`/api/auth/single/${id}`);
    setUser(response.data.user);
    setPosts(response.data.posts);

    if (response.data.following !== undefined) {
      setIsFollowing(response.data.following);
    }
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
    setNotification(
      {
        type: 'success',
        content: `Successfully followed user ${user.username}!`,
      },
      3
    );
  };

  const handleUnFollow = () => {
    if (user === null) {
      return null;
    }

    unfollowUser(user.url);
    setNotification(
      {
        type: 'success',
        content: `Successfully unfollowed user ${user.username}!`,
      },
      3
    );
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
          {isFollowing ? (
            <button
              className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => handleUserFollow()}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => handleUserFollow()}
            >
              Follow
            </button>
          )}
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

export default connect(null, { setNotification })(SingleUser);
