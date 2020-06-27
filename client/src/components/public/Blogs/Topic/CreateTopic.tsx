import React, { useState, ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export const CreateTopic: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleTopicCreation = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="container">
      <h3 className="font-mono text-2xl text-blue-500">Create topic</h3>
      <form onSubmit={handleTopicCreation}>
        <div className="max-w px-4 mt-10 mb-4 py-2 rounded shadow-md overflow-hidden">
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="border-0 hover:border-0 focus:outline-0 w-full text-2xl"
            placeholder="Title"
            maxLength={30}
          />
        </div>
        <div className="max-w px-4 mt-10 mb-4 py-2 rounded shadow-md overflow-hidden">
          <TextareaAutosize
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            placeholder="Description..."
            className="w-full"
            style={{ resize: 'none' }}
            translate="true"
            maxLength={100}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 float-right"
        >
          Create topic
        </button>
      </form>
    </div>
  );
};
