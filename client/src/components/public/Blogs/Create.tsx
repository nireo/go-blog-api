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

  const handlePostCreation = (event: FormEvent<HTMLFormElement>) => {
    // stop site from reloading
    event.preventDefault();

    const postObject = {
      title,
      description,
      text: JSON.stringify(value)
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
          <TextEditor value={value} />
        </div>
        <hr />
      </form>
    </div>
  );
};

export default connect(null, { createPost })(Create);
