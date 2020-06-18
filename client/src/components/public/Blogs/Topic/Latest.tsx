import React from 'react';
import { TopicWithPosts } from '../../../../interfaces/topic.interfaces';
import { Post } from '../../../../interfaces/post.interfaces';
import Blog from '../Blog';

type Props = {
  topic: TopicWithPosts;
};

export const Latest: React.FC<Props> = ({ topic }) => {
  return (
    <div>
      {topic.posts.slice(0, 3).map((post: Post) => (
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
