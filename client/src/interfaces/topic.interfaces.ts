import { Post } from './post.interfaces';

export interface TopicAction {
  title: string;
  description: string;
}

export interface Topic {
  title: string;
  uuid: string;
  description: string;
  url: string;
}

export interface TopicWithPosts {
  topic: Topic;
  posts: Post[];
}
