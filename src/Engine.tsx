import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import _ from 'lodash';
import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from './components/base/Loader';
import PageComponent from './containers/PageComponent';
import { navigationRef } from './navigation';
import { setProjectLoaded, setProjectDefinition } from './reducers/ProjectSlice';
import { TSchema, TPage } from './types/schema';

const Stack = createStackNavigator();

const Engine = ({ schema }: { schema: TSchema }) => {
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      dispatch(setProjectDefinition(schema));
   }, [schema]);

   const fonts: any = schema.design_system.fonts || {};

   const fontsToLoad = Object.keys(fonts)?.reduce((acc: any, curr) => {
      const name = fonts[curr].name,
         path = fonts[curr].font.replace('http://', 'https://');

      acc[name] = path;
      return acc;
   }, {});

   const [fontsLoaded] = useFonts(fontsToLoad);

   if (!fontsLoaded || _.isEmpty(schema)) {
      return <Loader />;
   }

   const indexPage = Object.values(schema?.pages || {}).filter(
      (page: TPage) => page.uid === schema.page_index
   )[0];

   return (
      <NavigationContainer ref={navigationRef}>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen key={schema.page_index} name={indexPage.uid}>
               {(props) => (
                  <PageComponent
                     componentId={indexPage.root_component}
                     page={indexPage}
                     {...props}
                  />
               )}
            </Stack.Screen>
            {Object.values(schema.pages)
               .filter((page: TPage) => page.uid !== schema.page_index)
               .map((page: TPage) => (
                  <Stack.Screen key={page.uid} name={page.uid}>
                     {(props) => (
                        <PageComponent componentId={page.root_component} page={page} {...props} />
                     )}
                  </Stack.Screen>
               ))}
         </Stack.Navigator>
      </NavigationContainer>
   );
};

export default Engine;
