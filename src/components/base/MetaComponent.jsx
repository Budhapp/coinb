import { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';

import Box from './../../containers/Box';
import MetaModal from './../../containers/MetaModal';
import BoxList from './../../containers/BoxList';
import Chart from './../../containers/Chart';
import Image from './../../containers/Image';
import Input from './../../containers/Input';
import Text from './../../containers/Text';
import { setComponent, initComponentStyling, updateAllComponentProperties, updateComponentStyling, updateComponentLayout } from './../../reducers/LocalDataSlice';
import { runWorkflow } from './../../reducers/WorkflowSlice';
import { safeMergeObjects, deepEqual, safeFlattenObjects } from './../../utils';
import { getWorkflows } from './../../utils/logic/triggerUtils';
import { getStyleForPlatform } from './../../utils/styleHelper/stylesHelper';
import { LinearGradient } from 'expo-linear-gradient';
import _ from 'lodash';

const MetaComponent = (props) => {
   const dispatch = useDispatch();

   const {
      parentId,
      parentStyle,
      parentLayout,
      designSystemStyle,
      colours,
      fonts,
      responsiveFactor,
      conditionalWorkflowIds,
      visualConditions,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      triggerConditionLogic,
      triggerVisualLogic,
      component,
      componentId,
      logic,
      visual_logic,
      custom_styling,
      properties,
      localProperties,
      initialStyle,
      actualStyle,
      componentData
   } = props;

   const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;

   const [visualLogic, setVisualLogic] = useState(Object.keys(visual_logic).sort().map(key => visual_logic[key]))
   useEffect(
      () => {
         setVisualLogic(Object.keys(visual_logic).sort().map(key => visual_logic[key]))
      },
      [visual_logic]
   )

   const windowDimensions = useWindowDimensions()
   
   const onClickWorkflows = getWorkflows(logic, 'trigger.onClick');
   const onStartWorkflows = getWorkflows(logic, 'trigger.onStart');
   const onAlternateClickWorkflows = getWorkflows(logic, 'trigger.onAlternateClick');
   const conditionWorkflows = getWorkflows(logic, 'trigger.condition');

   useLayoutEffect(() => {
      if (componentId === 'f66d7c4d-49c2-4858-9005-ebebf95ccf69')
         console.log('layout effect', parentStyle)
      const style = getStyleForPlatform({
         styles: safeMergeObjects(
            designSystemStyle?.styling || {},
            custom_styling || {}
         ),
         parentStyle,
         fonts,
         responsiveFactor,
         windowDimensions,
         debug: { uid, component, source: 'MetaComp 1'}
      });

      dispatch(
         setComponent({
            uid,
            component: {
               properties: { ...properties, dataCell },
               data: Object.values(componentData || {}).reduce((acc, val) => {
                  if (val && val.uid) {
                     acc[val.uid] = val.default;
                  }
                  return acc;
               }, {}),
               visualConditions: visualLogic.map((_) => false),
               actualStyle: style,
               initialStyle: style,
            },
         })
      );
   }, []);

   useEffect(() => {
      dispatch(initComponentStyling({
         uid: componentId, 
         value: getStyleForPlatform({
            styles: safeMergeObjects(
               designSystemStyle?.styling || {},
               custom_styling || {}
            ),
            parentStyle,
            colours,
            fonts,
            responsiveFactor,
            windowDimensions,
            debug: { component, source: 'MetaComp 2'}
         })
      }));
   }, [custom_styling, parentStyle]);

   useEffect(() => {
      const onStartWorkflows = getWorkflows(logic, 'trigger.onStart');

      if(onStartWorkflows.length > 0) {
         onStartWorkflows.map(async (workflow) =>
            dispatch(runWorkflow(uid, workflow, dataCellRootId))
         );
      }
   }, []);
   
   triggerVisualLogic(visualLogic, uid);
   triggerConditionLogic(logic, uid);

   useEffect(() => {
      // style overload
      if(visualConditions.some((item) => item)){
         // const extraStyles = {...(visualLogic.map((visualUpdate, i) => visualConditions[i] ? visualUpdate.styling || {} : {}))};

         const extraStyles = visualLogic.reduce(
            (acc, visualUpdate, i) => {
               return visualConditions[i] ? {...visualUpdate.styling, ...acc} : acc
            },
            {}
         )

         if(extraStyles && !_.isEmpty(initialStyle)) {
            const style = getStyleForPlatform({
               styles: extraStyles,
               parentStyle,
               colours,
               fonts,
               responsiveFactor,
               windowDimensions,
               debug: { component, source: 'MetaComp 3'}
            });
   
            const flattenStyle = safeFlattenObjects([
               style,
               initialStyle
            ]);
   
            if(!deepEqual(flattenStyle, actualStyle)) {
               dispatch(updateComponentStyling({uid: componentId, value: flattenStyle}));
            }
         }
      }
      else {
         if(!deepEqual(actualStyle, initialStyle)) {
            dispatch(updateComponentStyling({uid: componentId, value: initialStyle}));
         }
      }

      // properties overload
      const currProperties = safeFlattenObjects([
         properties,
         ...visualLogic.map((visualUpdate, i) => {
               return visualConditions[i] ? visualUpdate.properties || {} : {}
            }
         ),
      ]);

      if (!deepEqual(currProperties, localProperties)) {
         dispatch(updateAllComponentProperties({uid: componentId, props: currProperties}));
      }
   }, [parentStyle, visualConditions]);

   // handles component condition updates
   useEffect(() => {
      if (conditionalWorkflowIds.length > 0) {
         conditionalWorkflowIds.map(async (workflowId) => {
            dispatch(runWorkflow(uid, logic[workflowId], dataCellRootId));
         });
      }
   }, [conditionalWorkflowIds]);

   const handleOnPress = () => {
      onClickWorkflows.map(async (workflow) =>
         dispatch(runWorkflow(uid, workflow, dataCellRootId))
      );
   };

   const onLayout = (event) => {
      dispatch(updateComponentLayout({ uid, layout: event.nativeEvent.layout }));
   };

   // Component specifics
   const renderComponent = useMemo(() => {
      switch (component.type) {
         case 'boxList':
            return (
               <BoxList
                  dataCellSuffix={dataCellSuffix}
                  componentId={componentId}
                  parentId={parentId}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         case 'box':
            return (
               <Box
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  componentId={componentId}
                  parentId={parentId}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         case 'modal':
            return (
               <MetaModal
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  componentId={componentId}
                  parentId={parentId}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         case 'text':
            return (
               <Text
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  componentId={componentId}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         case 'image':
            return (
               <Image
                  resizeMode='contain'
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  componentId={componentId}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         case 'input':
            return (
               <Input
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  componentId={componentId}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         case 'chart':
            return (
               <Chart
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  style={actualStyle}
                  parentLayout={parentLayout}
               />
            );
         default:
            return <></>;
      }
   }, [parentLayout]);

   if (localProperties?.is_hidden === true ||
       localProperties?.is_hidden === 'true') {
      return null;
   }

   const { text, layout, ...rest } = actualStyle;
   const Wrapper = onClickWorkflows.length > 0 ? Pressable : View;

   return (
   <>
      { rest.gradient ?
         <View style={layout}>
            <LinearGradient style={{...rest}} {...rest.gradient}>
            <Wrapper style={!rest.gradient ? {...rest} : {}} onLayout={onLayout} key={uid} onPress={handleOnPress}>
               { renderComponent }
            </Wrapper>
            </LinearGradient>
         </View> : 
         <Wrapper style={{...rest}} onLayout={onLayout} key={uid} onPress={handleOnPress}>
            { renderComponent }
         </Wrapper>
      }
   </>
   )
};

export default MetaComponent;