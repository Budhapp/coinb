import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import PagesSlice from './PagesSlice';
import ProjectSlice from './ProjectSlice';
import LocalDataSlice from './LocalDataSlice';
import GlobalsSlice from './GlobalsSlice';
import UserDataSlice from './UserDataSlice';
import rootSaga from '../saga/';

const store = configureStore({
   reducer: {
      project: ProjectSlice,
      userData: UserDataSlice,
      pages: PagesSlice,
      local: LocalDataSlice,
      globals: GlobalsSlice,
   },
   middleware: [thunk], // logger
   devTools: process.env.NODE_ENV !== 'production',
});

export default store;
