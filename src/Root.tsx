import _ from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Engine from './Engine';
import Loader from './components/base/Loader';
import { fetchModel } from './reducers/ProjectSlice';

export const Root = () => {
   const dispatch = useDispatch();

   const [initializingProjectId, setInitializingProjectId] = useState(true);
   const schema = useSelector((state: Record<string, any>) => state?.project?.definition);

   const fetchProjectStructure = async () => {
      dispatch(fetchModel('dev'));
      setInitializingProjectId(false);
   };

   useEffect(() => {
      if (initializingProjectId) {
         fetchProjectStructure();
      }
   }, []);

   if (initializingProjectId) return null;

   if (_.isEmpty(schema)) {
      return <Loader />;
   }

   return <Engine schema={schema} />;
};
