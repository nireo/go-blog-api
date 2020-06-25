import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { getPostById, updatePost } from '../../../store/posts/reducer';
import { Post, ParagraphAction } from '../../../interfaces/post.interfaces';
import { Loading } from '../Misc/Loading';
import { getPostById as servicePostById } from '../../../services/post';
import Prism from 'prismjs';
import formatDate from '../../../utils/formatData';

type Props = {
  id: string;
  posts: Post[];
  getPostById: (id: string) => Promise<void>;
  updatePost: (post: Post, id: string) => Promise<void>;
};

const mapStateToProps = (state: AppState) => ({
  posts: state.post,
});

const SingleBlogPage: React.FC<Props> = ({
  id,
  posts,
  getPostById,
  updatePost,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [post, setPost] = useState<any>(undefined);

  const loadPost = useCallback(async () => {
    const data = await servicePostById(id);
    console.log(data);
    setPost(data);
  }, [id]);

  console.log(post);

  useEffect(() => {
    if (loaded === false) {
      loadPost();
      setLoaded(true);
    }
  }, [id, loaded, setLoaded, posts, getPostById]);

  if (loaded === false && post === undefined) {
    return <Loading />;
  }

  if (loaded === true && post === undefined) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Not found.</h2>
        <p>The post you're searching for hasn't been found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {post !== undefined && (
        <div>
          <div className="text-center">
            <h2 style={{ fontSize: '36px' }}>
              <strong>{post.post.title}</strong>
            </h2>
            <h6 className="text-gray-600">{post.post.description}</h6>
          </div>
          <div className="m-auto w-1/2 flex">
            <p className="text-muted">{formatDate(post.post.created_at)}</p>
            <p className="mt-4">{post.post.likes} &#128077;</p>
          </div>
          <div className="text-center">
            <img
              alt="post"
              className="m-auto w-1/2"
              src={post.post.image_url}
            />
          </div>
          {post.paragraphs.map((paragraph: ParagraphAction) => (
            <div className="m-auto w-1/2 mt-4 mb-4">
              {paragraph.type === 'text' && (
                <p style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  {paragraph.content}
                </p>
              )}
              {paragraph.type === 'code' && (
                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <pre className="line-numbers">
                    <code className="language-js">{paragraph.content}</code>
                  </pre>
                </div>
              )}
              {paragraph.type === 'list' && (
                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <ul style={{ listStyle: 'circle' }}>
                    {paragraph.content
                      .split('|LIST|')
                      .map((item: string, index: number) => {
                        if (
                          index ===
                          paragraph.content.split('|LIST|').length - 1
                        ) {
                          return null;
                        }
                        return <li>{item}</li>;
                      })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

setTimeout(() => Prism.highlightAll(), 0);

export default connect(mapStateToProps, { getPostById, updatePost })(
  SingleBlogPage
);
