import axios from "axios";
import { TopicAction } from "../interfaces/topic.interfaces";
const baseURL: string = "/api/topics";

let token: null | string = null;

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token,
  },
});

export const createTopic = async (newTopic: TopicAction) => {
  const response = await axios.post(baseURL, newTopic, getConfig());
  return response.data;
};

export const getTopics = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};

export const getSingleTopic = async (url: string) => {
  const response = await axios.get(`${baseURL}/single/${url}`);
  return response.data;
};

export const deleteTopic = async (id: string) => {
  const response = await axios.delete(`${baseURL}/${id}`, getConfig());
  return response.data;
};

export const getUsersTopics = async () => {
  const response = await axios.get(`${baseURL}/user`, getConfig());
  return response.data;
};

export const updateTopic = async (id: string, updatedTopic: TopicAction) => {
  const response = await axios.patch(
    `${baseURL}/${id}`,
    updatedTopic,
    getConfig()
  );
  return response.data;
};
