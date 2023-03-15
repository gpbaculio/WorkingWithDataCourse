import {SET_SHOW_MODAL} from './constants';

export type ModalStateType = {
  showModal: boolean;
};

export type SetShowModal = {
  type: typeof SET_SHOW_MODAL;
  payload: {value: boolean};
};

export type ModalActionTypes = SetShowModal;
