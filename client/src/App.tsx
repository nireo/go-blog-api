import React from "react";
import MainPage from "./components/public/Blogs/MainPage";
import SingleBlogPage from "./components/public/Blogs/SingleBlogPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/public/Layout/Navbar";
import "./styles.css";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
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
