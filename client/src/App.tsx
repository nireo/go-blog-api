import React from "react";
import MainPage from "./components/public/Blogs/MainPage";
import SingleBlogPage from "./components/public/Blogs/SingleBlogPage";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from "react-router-dom";
import "./styles.css";

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => <MainPage />} />
                <Route
                    exact
                    path="/blog/:id"
                    render={({ match }) => (
                        <SingleBlogPage id={match.params.id} />
                    )}
                />
            </Switch>
        </Router>
    );
};

export default App;
