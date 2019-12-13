import React from 'react';
import SingleBlogPage from './components/public/Blogs/SingleBlogPage';
import Create from './components/public/Blogs/Create';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/public/Layout/Navbar';
import { NotFound } from './components/public/Misc/NotFound';
import './styles.css';
import { Welcome } from './components/public/Home/Welcome';
import { TopicMain } from './components/public/Blogs/Topic/TopicMain';
import MainPage from './components/public/Blogs/MainPage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <Welcome />} />
        <Route exact path="/all" render={() => <MainPage />} />
        <Route
          exact
          path="/blog/:id"
          render={({ match }) => <SingleBlogPage id={match.params.id} />}
        />
        <Route
          exact
          path="/topic/:term"
          render={({ match }) => <TopicMain topic={match.params.term} />}
        />
        <Route exact path="/create" render={() => <Create />} />
        <Route render={() => <NotFound />} />
      </Switch>
    </Router>
  );
};

export default App;
