import { Animated, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setPage, addScrollComponent, componentsLoaded, updatePageLayout } from './../../reducers/LocalDataSlice';
import MetaComponent from '../../containers/MetaComponent';
import { useRoute, useNavigation } from '@react-navigation/native';

const PageComponent = (props) => {
   const { componentId, navigation, page } = props;
   const dispatch = useDispatch();
   const scrollRef = useRef(null);
   const {storeLayout} = props;
   let layout = {};
   const onPageLayout = (event) => {
      layout = event.nativeEvent.layout;
      const { width, height, x, y, left, top } = layout;
      if (storeLayout?.width !== Math.floor(width) || storeLayout?.height !== Math.floor(height) || storeLayout?.top !== Math.floor(x)) {
         dispatch(updatePageLayout({ width: Math.floor(width), height: Math.floor(height), x: Math.floor(x), y: Math.floor(y) }));
      }
   };

   useEffect(() => {
      dispatch(setPage({ uid: componentId, page, navigation }))
      dispatch(addScrollComponent({ uid: 'rootScroll', component: scrollRef.current }))
      dispatch(componentsLoaded());
   }, [])

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ height: Dimensions.get('window').height }}
            style={{ flex: 1, height: Dimensions.get('window').height }}
            onLayout={onPageLayout}>
            <MetaComponent componentId={componentId} parentLayout={layout} />
         </ScrollView>
      </SafeAreaView>
   )
};

export default PageComponent;