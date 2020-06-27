import React, { useState, ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { connect } from 'react-redux';
import { setNotification } from '../../../../store/notification/reducer';
import { Notification } from '../../../../interfaces/notification.interfaces';
import { createTopicAction } from '../../../../store/topics/reducer';
import { TopicAction } from '../../../../interfaces/topic.interfaces';

type Props = {
  setNotification: (newNotification: Notification, duration: number) => void;
  createTopicAction: (newTopic: TopicAction) => void;
};

const CreateTopic: React.FC<Props> = ({
  setNotification,
  createTopicAction,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleTopicCreation = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !description) {
      return;
    }

    createTopicAction({ title, description });
    setNotification(
      { type: 'success', content: 'Topic has been successfully created!' },
      3
    );
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

export default connect(null, { setNotification, createTopicAction })(
  CreateTopic
);
