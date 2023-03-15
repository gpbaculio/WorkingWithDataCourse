import {combineReducers, configureStore} from '@reduxjs/toolkit';

import {reducer as modalReducer} from './modal';

const reducer = combineReducers({
  modal: modalReducer,
});

export type AppReducerType = ReturnType<typeof reducer>;

export default configureStore({
  reducer,
});
