import React, { useEffect } from 'react';
import SingleBlogPage from './components/public/Blogs/SingleBlogPage';
import Create from './components/public/Blogs/Create';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/public/Layout/Navbar';
import { NotFound } from './components/public/Misc/NotFound';
import './styles.css';
import Welcome from './components/public/Home/Welcome';
import { TopicMain } from './components/public/Blogs/Topic/TopicMain';
import MainPage from './components/public/Blogs/MainPage';
import { User } from './interfaces/user.interfaces';
import { connect } from 'react-redux';
import { AppState } from './store';
import { checkLocalStorage } from './store/user/reducer';
import YourBlogs from './components/public/User/YourBlogs';
import Login from './components/public/User/Login';
import Register from './components/public/User/Register';
import { About } from './components/public/Misc/About';
import { ProtectedRoute } from './components/public/User/ProtectedRoute';
import Dashboard from './components/public/User/Dashboard';

type Props = {
  user: User | null;
  checkLocalStorage: () => void;
};

const App: React.FC<Props> = ({ user, checkLocalStorage }) => {
  useEffect(() => {
    if (user === null) {
      checkLocalStorage();
    }
  }, [checkLocalStorage, user]);

  return (
    <Router>
      <div>
        <Navbar />
      </div>
      <Switch>
        <Route exact path="/" render={() => <Welcome />} />
        <Route exact path="/login" render={() => <Login />} />
        <Route exact path="/register" render={() => <Register />} />
        <Route exact path="/all" render={() => <MainPage />} />
        <Route exact path="/about" render={() => <About />} />

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
        <ProtectedRoute user={user} exact={true} path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
        <Route exact path="/create" render={() => <Create />} />
        <Route exact path="/your-blogs" render={() => <YourBlogs />} />
        <Route render={() => <NotFound />} />
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps, { checkLocalStorage })(App);
