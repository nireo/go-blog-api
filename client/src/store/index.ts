import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./user/reducer";
import postReducer from "./posts/reducer";

const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppState = ReturnType<typeof rootReducer>;

export default store;
