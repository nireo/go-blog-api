import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../../interfaces/user.interfaces';
import axios from 'axios';

type Props = {
  id: string;
};

export const SingleUser: React.FC<Props> = ({ id }) => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(async () => {
    const response = await axios.get(`/api/auth/single/${id}`);
    setUser(response.data);
  }, [id]);

  useEffect(() => {
    if (user === null) {
      loadUser();
    }
  }, []);

  return (
    <div className="container">
      {user === null && <div className="text-center">Loading...</div>}
      {user !== null && (
        <div>
          <h2>{user.username}</h2>
        </div>
      )}
    </div>
  );
};
