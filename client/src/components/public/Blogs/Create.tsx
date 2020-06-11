import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../../store/posts/reducer';
import { CreatePost } from '../../../interfaces/post.interfaces';
import TextareaAutosize from 'react-textarea-autosize';
import { CodeEditor } from './CodeEditor';
import { Topic } from '../../../interfaces/topic.interfaces';
import { getTopics } from '../../../services/topic';
import axios from 'axios';

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
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [newListItem, setNewListItem] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [topics, setTopics] = useState<Topic[] | null>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [search, setSearch] = useState<string>('');

  const loadTopics = useCallback(async () => {
    let data = await axios.get('/api/topics');
    setTopics(data.data);
  }, []);

  useEffect(() => {
    if (topics === null) {
      loadTopics();
    }
  }, [loadTopics, topics, page]);

  console.log(topics);

  const changeParagraphContent = (value: string, index: number) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].content = value;

    setParagraphs(
      paragraphs.map((p) =>
        p.id === paragraphsCopy[index].id ? paragraphsCopy[index] : p
      )
    );
  };

  const changeCodeContent = (value: string, index: number) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].content = value;
    updateParagraphList(paragraphsCopy[index]);
  };

  const changeParagraphType = (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].type = event.target.value;
    updateParagraphList(paragraphsCopy[index]);
  };

  const createNewParagraph = () => {
    let id = Math.floor(Math.random() * 100);
    setParagraphs(paragraphs.concat({ content: '', id, type: 'text' }));
  };

  const updateParagraphList = (editedParagraph: Paragraph) => {
    setParagraphs(
      paragraphs.map((p) => (p.id === editedParagraph.id ? editedParagraph : p))
    );
  };

  const addNewListItem = (index: number) => {
    let paragraphsCopy = paragraphs;
    paragraphsCopy[index].content =
      paragraphsCopy[index].content + newListItem + '|LIST|';
    updateParagraphList(paragraphsCopy[index]);
  };

  return (
    <div className="container">
      <h3 className="font-mono text-blue-500 text-4xl mt-8">Write</h3>
      <p className="text-gray-600">
        Here you can write about the topic you're interested in!
      </p>
      {page === 0 && (
        <div>
          <div>
            <button
              onClick={() => setPage(1)}
              className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 float-right"
            >
              Next page
            </button>
          </div>
          <br />
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
                    onChange={({ target }) =>
                      changeParagraphContent(target.value, index)
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
                {paragraph.type === 'quote' && (
                  <div>
                    <input
                      value={paragraph.content}
                      className="text-2xl italic text-gray-400"
                      onChange={({ target }) =>
                        changeParagraphContent(target.value, index)
                      }
                    />
                  </div>
                )}
                {paragraph.type === 'list' && (
                  <div>
                    <ul style={{ listStyle: 'circle' }}>
                      {paragraph.content !== '' ? (
                        paragraph.content
                          .split('|LIST|')
                          .map((item: string) => {
                            if (item !== '') {
                              return <li>{item}</li>;
                            }

                            return null;
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
        </div>
      )}
      {page === 1 && (
        <div className="mt-4">
          <div>
            <button
              onClick={() => setPage(0)}
              className="bg-blue-500 mb-4 hover:bg-blue-700 text-white font-bold py-2 px-4"
            >
              Previous Page
            </button>
          </div>
          <div className="mb-4">
            <h4 className="text-2xl font-mono text-blue-500 mb-2">Topic</h4>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              value={search}
              placeholder="Search for topic"
              onChange={({ target }) => setSearch(target.value)}
            />
            {topics?.map((topic: Topic) => (
              <div>{topic.title}</div>
            ))}
          </div>
          <div>
            <h4 className="text-2xl font-mono text-blue-500 mb-2">Image</h4>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                value={image}
                placeholder="Image URL"
                onChange={({ target }) => setImage(target.value)}
              />
              {topics?.map((topic: Topic) => (
                <div>{topic.title}</div>
              ))}
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="text-3xl bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-24 rounded-full">
              Publish!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(null, { createPost })(Create);
