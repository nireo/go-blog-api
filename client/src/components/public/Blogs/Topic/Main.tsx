import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { User } from '../../../../interfaces/user.interfaces';

type Props = {
  user?: User;
};

const Main: React.FC<Props> = ({ user }) => {
  return <div></div>;
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Main);
