import {SET_SHOW_MODAL} from './constants';
import {SetShowModal} from './types';

export const setShowModal = (value: boolean): SetShowModal => ({
  type: SET_SHOW_MODAL,
  payload: {value},
});
