import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (routeName: string, params?: object) => {
   if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.navigate(routeName, params));
   }
};
