import { createStore, combineReducers } from "redux";
import userReducer from "./user/reducers";
import postReducer from "./posts/reducers";

const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer
});
const store = createStore(rootReducer);

export type AppState = ReturnType<typeof rootReducer>;

export default store;
