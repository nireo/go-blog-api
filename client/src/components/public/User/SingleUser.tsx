import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../../interfaces/user.interfaces';
import axios from 'axios';
import formatDate from '../../../utils/formatData';
import { Post } from '../../../interfaces/post.interfaces';

type Props = {
  id: string;
};

export const SingleUser: React.FC<Props> = ({ id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  const loadUser = useCallback(async () => {
    const response = await axios.get(`/api/auth/single/${id}`);
    setUser(response.data);
  }, [id]);

  useEffect(() => {
    if (user === null) {
      loadUser();
    }
  }, []);

  const handleUserFollow = () => {};

  return (
    <div className="container">
      {user === null && <div className="text-center">Loading...</div>}
      {user !== null && (
        <div>
          <h2 className="text-3xl">{user.username}</h2>
          <h2 className="text-gray-600">
            Signed up: {formatDate(user.created)}
          </h2>
          <button
            className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => handleUserFollow()}
          >
            Follow
          </button>
        </div>
      )}
    </div>
  );
};
