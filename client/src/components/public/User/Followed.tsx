import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../../interfaces/user.interfaces';
import { Topic } from '../../../interfaces/topic.interfaces';
import {
  getFollowedPage,
  unfollowTopic,
  unfollowUser,
} from '../../../services/user';
import { Link } from 'react-router-dom';

export const Followed: React.FC = () => {
  const [followedUsers, setFollowedUsers] = useState<User[] | null>(null);
  const [followedTopics, setFollowedTopics] = useState<Topic[] | null>(null);

  const loadData = useCallback(async () => {
    const data = await getFollowedPage();
    setFollowedTopics(data.followedTopics);
    setFollowedUsers(data.followedUsers);
  }, []);

  useEffect(() => {
    if (followedTopics === null && followedUsers === null) {
      loadData();
    }
  }, []);

  const handleUserUnFollow = (urlUsername: string) => {
    if (window.confirm(`Are you sure you want to unfollow ${urlUsername}`)) {
      unfollowUser(urlUsername);
    }
  };

  const handleTopicUnFollow = (topicUrl: string) => {
    if (window.confirm(`Are you sure you want to unfollow ${topicUrl}`)) {
      unfollowTopic(topicUrl);
    }
  };

  return (
    <div className="container">
      <h2 className="text-blue-500 font-mono text-3xl">Followed Users</h2>
      {followedUsers?.map((user: User) => (
        <div className="shadow-md w-full py-4 px-4 rounded mb-4">
          <h4 className="text-xl text-blue-500 font-mono">{user.username}</h4>
          <div>
            <button
              className="bg-blue-500 mr-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => handleUserUnFollow(user.url)}
            >
              Remove follow
            </button>
            <Link
              to={`/profile/{user.username}`}
              className="text-blue-500 hover:text-blue-400"
            >
              Profile
            </Link>
          </div>
        </div>
      ))}
      <hr className="my-6"></hr>
      <h2 className="text-blue-500 font-mono text-3xl">Followed Topics</h2>
      {followedTopics?.map((topic: Topic) => (
        <div className="shadow-md w-full py-4 px-4 rounded mb-4">
          <h4 className="text-xl text-blue-500 font-mono">{topic.title}</h4>
          <p className="text-gray-600">{topic.description}</p>
          <button
            className="bg-blue-500 mr-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => handleTopicUnFollow(topic.url)}
          >
            Remove follow
          </button>
          <Link
            to={`/topic/{topic.url}`}
            className="text-blue-500 hover:text-blue-400"
          >
            Topic
          </Link>
        </div>
      ))}
    </div>
  );
};
