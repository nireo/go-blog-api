import React, { useState, FormEvent } from 'react';
import { Value } from 'slate';
import TextEditor from './TextEditor';
import initialValue from './value.json';
import { connect } from 'react-redux';
import { createPost } from '../../../store/posts/reducer';
import { CreatePost } from '../../../interfaces/post.interfaces';

type Props = {
  createPost: (post: CreatePost) => Promise<void>;
};

const Create: React.FC<Props> = ({ createPost }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [value] = useState(Value.fromJSON(initialValue as any));
  const [topic, setTopic] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handlePostCreation = (event: FormEvent<HTMLFormElement>) => {
    // stop site from reloading
    event.preventDefault();

    const postObject = {
      title,
      description,
      text: content,
      topic,
      imageURL: image
    };

    createPost(postObject);
  };

  return (
    <div className="container">
      <form onSubmit={handlePostCreation}>
        <div>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={{
              border: 'none',
              fontSize: '36px',
              fontFamily: 'Raleway sans-serif',
              width: '100%'
            }}
            placeholder="Title..."
          />
        </div>
        <div>
          <input
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            style={{
              border: 'none',
              fontSize: '20px',
              fontFamily: 'Raleway sans-serif',
              color: '#6c757d',
              width: '100%'
            }}
            placeholder="Description..."
          />
        </div>
        <div style={{ width: '100%' }}>
          <textarea
            value={content}
            onChange={({ target }) => setContent(target.value)}
            placeholder="Content..."
            style={{
              border: 'none',
              width: '100%',
              fontFamily: 'Merriweather, serif'
            }}
          ></textarea>
        </div>
        <hr />
        <label>
          Select topic{'   '}
          <select
            value={topic}
            onChange={({ target }) => setTopic(target.value)}
            className="form-control form-control-sm"
          >
            <option value="programming">Programming</option>
            <option value="ai">Artificial intelligence</option>
            <option value="technology">Technology</option>
            <option value="self-improvement">Self improvement</option>
            <option value="fitness">Fitness</option>
          </select>
        </label>
        <input
          className="form-control form-control-sm"
          value={image}
          onChange={({ target }) => setImage(target.value)}
          type="text"
          placeholder="Image url..."
        />
        <hr />
        <button type="submit" className="get-started-button-big">
          Create post
        </button>
      </form>
    </div>
  );
};

export default connect(null, { createPost })(Create);
