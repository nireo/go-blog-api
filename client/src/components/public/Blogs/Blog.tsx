import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  description: string;
  id: string;
  title: string;
  likes: number;
  url?: string;
};

const Blog: React.FC<Props> = ({ description, id, title, likes, url }) => {
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex">
      <div
        style={{ width: '100%' }}
        className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"
      >
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center"></p>
          <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
        <div className="flex items-center">
          <div className="text-sm">
            <p className="text-gray-900 leading-none">Writer</p>
            <p className="text-gray-600">Aug 18</p>
          </div>
          <button className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
