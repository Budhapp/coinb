import _                 from 'lodash';
import * as fetchUserData from './fetchUserData';

import {all}  from 'redux-saga/effects';

export default function* rootSaga()
{
  const sagas = { fetchUserData };

  yield all(_.flatMap(sagas, (c) => _.map(c, s => s())));
}
