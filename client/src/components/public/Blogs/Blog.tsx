import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatData";

type Props = {
  description: string;
  id: string;
  title: string;
  likes: number;
  uuid: string;
  url?: string;
  created?: string;
  writer?: String;
};

const Blog: React.FC<Props> = ({
  description,
  id,
  title,
  likes,
  url,
  uuid,
  created,
  writer,
}) => {
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex">
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{ backgroundImage: `url('${url}')` }}
      ></div>
      <div
        style={{ width: "100%" }}
        className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"
      >
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center"></p>
          <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
        <div className="flex items-center">
          <div className="text-sm">
            {writer !== undefined ? (
              <p className="text-gray-900 leading-none">{writer}</p>
            ) : (
              <div></div>
            )}
            {created !== undefined ? (
              <p className="text-gray-600">{formatDate(created)}</p>
            ) : (
              <div></div>
            )}
          </div>
          <Link to={`/post/${uuid}`}>
            <button className="bg-blue-500 ml-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Read
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
