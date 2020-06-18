import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './user/reducer';
import postReducer from './posts/reducer';
import topicReducer from './topics/reducer';
import notificationReducer from './notification/reducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  topic: topicReducer,
  notification: notificationReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppState = ReturnType<typeof rootReducer>;

export default store;
