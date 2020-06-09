import React from 'react';
import { User } from '../../../interfaces/user.interfaces';
import { Route, Redirect } from 'react-router-dom';

type Props = {
  user?: User | null;
  exact?: boolean;
  path?: string;
};

export const ProtectedRoute: React.FC<Props> = ({
  children,
  user,
  exact,
  path,
}) => {
  return (
    <Route
      exact={exact === undefined ? false : true}
      path={path}
      render={({ location }) =>
        user !== null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
