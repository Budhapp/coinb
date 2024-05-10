import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import * as schema from './assets/schema.json';
import Engine from './src/Engine';
import store from './src/reducers';
import { Root } from './src/Root';

const App = () => {
   return (
      <Provider store={store}>
      <GestureHandlerRootView style={styles.flex}>
         <SafeAreaProvider>
            <StatusBar style='light' translucent backgroundColor='transparent' />
            <Root/>
         </SafeAreaProvider>
      </GestureHandlerRootView>
   </Provider>
   );
};

const styles = StyleSheet.create({
   flex: {
      flex: 1,
   },
});

export default App;
