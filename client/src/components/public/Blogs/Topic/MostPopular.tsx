import React, { useState, useEffect } from 'react';
import { TopicWithPosts } from '../../../../interfaces/topic.interfaces';
import { Post } from '../../../../interfaces/post.interfaces';
import Blog from '../Blog';

type Props = {
  topic: TopicWithPosts;
};

const sortByLikes = (a: Post, b: Post) => {
  if (a.likes < b.likes) {
    return -1;
  } else if (a.likes > b.likes) {
    return 1;
  }
  return 0;
};

export const MostPopular: React.FC<Props> = ({ topic }) => {
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (!loaded && sortedPosts.length === 0) {
      setSortedPosts(topic.posts.sort(sortByLikes));
      setLoaded(true);
    }
  }, []);

  return (
    <div>
      {sortedPosts.map((post: Post) => (
        <div key={`${post.id}`} style={{ marginBottom: '2rem' }}>
          <Blog
            id={String(post.id)}
            likes={post.likes}
            title={post.title}
            description={post.description}
            url={post.image_url}
            uuid={post.uuid}
            created={post.created_at}
          />
        </div>
      ))}
    </div>
  );
};
