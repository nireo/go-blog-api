import React, { useState, FormEvent, ChangeEvent } from 'react';
import initialValue from './value.json';
import { connect } from 'react-redux';
import { createPost } from '../../../store/posts/reducer';
import { CreatePost } from '../../../interfaces/post.interfaces';
import TextareaAutosize from 'react-textarea-autosize';
import { CodeEditor } from './CodeEditor';

type Props = {
  createPost: (post: CreatePost) => Promise<void>;
};

interface Paragraph {
  content: string;
  id: number;
  type: string;
}

const Create: React.FC<Props> = ({ createPost }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [newListItem, setNewListItem] = useState<string>('');

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

  const changeParagraphContent = (
    event: ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].content = event.target.value;

    setParagraphs(
      paragraphs.map((p) =>
        p.id === paragraphsCopy[index].id ? paragraphsCopy[index] : p
      )
    );
  };

  const changeCodeContent = (value: string, index: number) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].content = value;

    setParagraphs(
      paragraphs.map((p) =>
        p.id === paragraphsCopy[index].id ? paragraphsCopy[index] : p
      )
    );
  };

  const changeParagraphType = (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].type = event.target.value;

    setParagraphs(
      paragraphs.map((p) =>
        p.id === paragraphsCopy[index].id ? paragraphsCopy[index] : p
      )
    );
  };

  const createNewParagraph = () => {
    let id = Math.floor(Math.random() * 100);
    setParagraphs(paragraphs.concat({ content: '', id, type: 'text' }));
  };

  const addNewListItem = (index: number) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].content =
      paragraphsCopy[index].content + newListItem + '|LIST|';

    setParagraphs(
      paragraphs.map((p) =>
        p.id === paragraphsCopy[index].id ? paragraphsCopy[index] : p
      )
    );
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
            <TextareaAutosize
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              placeholder="Description..."
              className="w-full"
              style={{ resize: 'none' }}
              translate="true"
            />
          </div>
        </div>
        <div className="mb-12">
          <div className="mb-4 mt-10">
            <h4 className="font-mono text-2xl text-blue-500">Content</h4>
            <p className="text-gray-600">
              Please create a new text box for each paragraph
            </p>
          </div>
          {paragraphs.map((paragraph: Paragraph, index: number) => (
            <div
              className="max-w px-4 mt-10 mb-4 py-2 rounded shadow-md overflow-hidden"
              key={index}
            >
              {paragraph.type === 'text' && (
                <TextareaAutosize
                  value={paragraph.content}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    changeParagraphContent(event, index)
                  }
                  placeholder="Content..."
                  className="w-full"
                  style={{ resize: 'none', overflow: 'auto' }}
                  translate="true"
                />
              )}
              {paragraph.type === 'code' && (
                <div>
                  <CodeEditor
                    value={paragraph.content}
                    setValue={changeCodeContent}
                    index={index}
                  />
                </div>
              )}
              {paragraph.type === 'list' && (
                <div>
                  <ul style={{ listStyle: 'circle' }}>
                    {paragraph.content !== '' ? (
                      paragraph.content.split('|LIST|').map((item: string) => {
                        if (item !== '') {
                          return <li>{item}</li>;
                        }
                      })
                    ) : (
                      <div></div>
                    )}
                  </ul>
                  <div className="flex mb-2">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      onChange={({ target }) => setNewListItem(target.value)}
                      value={newListItem}
                    />
                    <button
                      onClick={() => addNewListItem(index)}
                      className="bg-blue-500 ml-6 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <hr></hr>
              <div className="relative">
                <select
                  value={paragraph.type}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    changeParagraphType(event, index)
                  }
                  className="block text-sm appearance-none bg-gray-200 border border-gray-200 text-blue-500 mt-2 py-1 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="text">Text</option>
                  <option value="code">Code</option>
                  <option value="quote">Quote</option>
                  <option value="list">List</option>
                </select>
              </div>
            </div>
          ))}
          <button
            onClick={() => createNewParagraph()}
            className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Create new text box
          </button>
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
