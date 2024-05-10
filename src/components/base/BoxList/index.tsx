import { ViewProps, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Loader from '../Loader';
import { useEffect } from 'react';
import MetaComponent from './../../../containers/MetaComponent';
import { TBox, TComponent } from 'src/types/schema';
import { TCreateComponentFuncAsProp } from 'src/types/general';

type TProps = TBox & TCreateComponentFuncAsProp & Pick<ViewProps, 'style'>;

const BoxList = (props: TProps) => {

   const { component, style, parentLayout, componentData, properties, dataCellRootId, components} = props;
   const { uid } = component;

   useEffect(() => {
      props.runWorkflow(uid, properties?.list_of_items, dataCellRootId)
   }, [properties])

   return (
      <View style={style.layout}>
         {
            Object.keys(componentData).length > 0 ?
            Object.keys(componentData).map((key, index)=> {
               const data = componentData[key];
               const childComponent = components[0];
   
               return (
                  <MetaComponent
                     key={key}
                     dataCellSuffix={index}
                     dataCellRootId={`${childComponent.uid}_${index}`}
                     dataCell={data}
                     parentId={uid}
                     componentId={childComponent.uid}
                     parentStyle={style.layout}
                     parentLayout={parentLayout} />
                  )
               })
               : <Loader/>
         }
      </View>
   )
};

export default BoxList;
