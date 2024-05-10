import { View as RNView, ViewProps, ImageBackground, Image, Platform } from 'react-native';
import type { TBox, TComponent } from './../../types';
import { LinearGradient } from 'expo-linear-gradient';
import MetaComponent from '../../../containers/MetaComponent';
import { TCreateComponentFuncAsProp } from 'src/types/general';

type TProps = TBox & TCreateComponentFuncAsProp & Pick<ViewProps, 'style'>;

const Box = ({ componentId, components, style, parentLayout, dataCellSuffix, dataCellRootId}: TProps) => {

   const backgroundChildren = Object.values(components || []).filter((child: TComponent) =>
      child?.custom_styling?.position === 'absolute' ||
      child?.custom_styling?.position === 'relative'
   );

   const fixedChildren = Object.values(components || []).filter((child: TComponent) =>
      child?.custom_styling?.position === 'fixed'
   );

   const regularChildren = Object.values(components || []).filter((child: TComponent) =>
      child?.custom_styling?.position || 'auto' === 'auto'
   );

   const BoxWrapper = style?.image?.uri ? ImageBackground : RNView;

   // TODO: Handle fixed positioning
   return (
      <BoxWrapper
         resizeMode="cover"
         style={[style.layout, {flex: 1}]}
         source={{ uri: style?.image?.uri }}>
         {/* for fixed positioning */}
         {fixedChildren.length > 0 &&
            fixedChildren
               .sort((a: TComponent, b: TComponent) => a.order - b.order)
               .map((child: TComponent) => <MetaComponent
                  dataCellRootId={dataCellRootId}
                  dataCellSuffix={dataCellSuffix}
                  key={child.uid}
                  componentId={child.uid}
                  parentId={componentId}
                  parentStyle={style.layout}
                  parentLayout={parentLayout}/>)
         }
         {/* for absolute/relative positioning */}
         {backgroundChildren?.length > 0 &&
            <RNView key={'background'} style={[{ flex: 1 }]}>
               {
                  backgroundChildren
                     .sort((a: TComponent, b: TComponent) => a.order - b.order)
                     .map((child: TComponent) => <MetaComponent
                        dataCellRootId={dataCellRootId}
                        dataCellSuffix={dataCellSuffix}
                        key={child.uid}
                        componentId={child.uid}
                        parentId={componentId}
                        parentStyle={style.layout}
                        parentLayout={parentLayout}/>)
               }
            </RNView>
         }
         {regularChildren?.length > 0 &&
            regularChildren
               .sort((a: TComponent, b: TComponent) => a.custom_styling?.position?.auto?.order - b.custom_styling?.position?.auto?.order)
               .map((child: TComponent) =>
                  <MetaComponent
                     dataCellRootId={dataCellRootId}
                     dataCellSuffix={dataCellSuffix}
                     key={child.uid}
                     componentId={child.uid}
                     parentId={componentId}
                     parentStyle={style.layout}
                     parentLayout={parentLayout}/>
               )
         }
      </BoxWrapper>
   );
};

export default Box;
