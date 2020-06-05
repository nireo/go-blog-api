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
      imageURL: image,
    };

    createPost(postObject);
  };

  return (
    <div className="container">
      <h3 className="font-mono text-blue-500 text-4xl mt-8">Write</h3>
      <p className="text-gray-600">
        Here you can write about the topic you're interested in!
      </p>
      <form onSubmit={handlePostCreation} style={{ width: '100%' }}>
        <div>
          <div className="max-w px-4 mt-10 mb-4 py-2 rounded shadow-md overflow-hidden">
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              className="border-0 hover:border-0 focus:outline-0 w-full text-2xl"
              placeholder="Title"
            />
          </div>
          <div className="max-w px-4 mt-10 mb-4 py-2 rounded shadow-md overflow-hidden">
            <input
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              placeholder="Description..."
            />
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <textarea
            value={content}
            onChange={({ target }) => setContent(target.value)}
            placeholder="Content..."
            style={{
              border: 'none',
              width: '100%',
              fontFamily: 'Merriweather, serif',
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
