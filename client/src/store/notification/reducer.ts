import { Dispatch } from 'redux';
import { Notification } from '../../interfaces/notification.interfaces';

const reducer = (state: Notification | null = null, action: any) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;
    case 'CLEAR_NOTIFICATION':
      return null;
    default:
      return state;
  }
};

export const setNotification = (
  newNotification: Notification,
  duration: number
) => {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: newNotification,
    });

    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      });
    }, duration * 1000);
  };
};

export const clearNotificationAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: 'CLEAR_NOTIFICATION',
    });
  };
};

export default reducer;
