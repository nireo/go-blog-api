import { Dispatch } from 'redux';
import { Topic, TopicAction } from '../../interfaces/topic.interfaces';
import {
  getTopics,
  deleteTopic,
  getSingleTopic,
  createTopic,
} from '../../services/topic';

const reducer = (state: Topic[] = [], action: any) => {
  switch (action.type) {
    case 'INIT_TOPICS':
      return action.data;
    case 'DELETE_TOPIC':
      return state.filter((topic: Topic) => topic.uuid !== action.id);
    case 'GET_SINGLE_TOPIC':
      return [...state, action.data];
    case 'CREATE_TOPIC':
      return [...state, action.data];
    case 'CLEAR_TOPICS':
      return [];
    default:
      return state;
  }
};

export const clearTopicsAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: 'CLEAR_TOPICS',
    });
  };
};

export const getTopicsAction = () => {
  return async (dispatch: Dispatch) => {
    const topics = await getTopics();
    dispatch({
      type: 'INIT_TOPICS',
      data: topics,
    });
  };
};

export const deleteTopicAction = (id: string) => {
  return async (dispatch: Dispatch) => {
    await deleteTopic(id);
    dispatch({
      type: 'DELETE_TOPIC',
      id: id,
    });
  };
};

export const getSingleTopicAction = (id: string) => {
  return async (dispatch: Dispatch) => {
    const topic = await getSingleTopic(id);
    dispatch({
      type: 'GET_SINGLE_TOPIC',
      data: topic,
    });
  };
};

export const createTopicAction = (newTopic: TopicAction) => {
  return async (dispatch: Dispatch) => {
    const createdTopic = await createTopic(newTopic);
    dispatch({
      type: 'CREATE_TOPIC',
      data: createdTopic,
    });
  };
};

export default reducer;
