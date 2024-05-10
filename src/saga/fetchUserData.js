import { takeEvery, put, call, take, select } from 'redux-saga/effects';
import { fetchDataBegin, fetchDataError, fetchDataSuccess } from './../reducers/LocalDataSlice';
import { fetchUrl } from './../utils/fetch/fetchUserData';
import { resolveInlineLogic } from './../hooks/useConditionLogic';

export function* watchFetch(){
  while (true)
  {
    try
    {
      let dataFromAction = yield take('local/fetchStart');
      let state = yield select();
      const {payload: {key}} = dataFromAction;
      let component = state.project.components[dataFromAction.payload.key];
      let localData = state.project;
      let globals = state.globals;
      let {url, params} = resolveInlineLogic(component.properties.list_of_items, {localData, globals})
      yield put(fetchDataBegin({key}));
      const data = yield call(fetchUrl, url);
      yield put(fetchDataSuccess({key, data}));
    }
    catch (e)
    {
      yield put(fetchDataError({key, error}));
    }
  }
}