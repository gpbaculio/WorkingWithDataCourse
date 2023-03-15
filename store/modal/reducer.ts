import {ModalActionTypes, ModalStateType} from './types';
import {SET_SHOW_MODAL} from './constants';

const initialState: ModalStateType = {
  showModal: false,
};

const reducer = (
  state = initialState,
  action: ModalActionTypes,
): ModalStateType => {
  switch (action.type) {
    case SET_SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload.value,
      };

    default:
      return state;
  }
};

export default reducer;
