import { View, Modal, ViewProps, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import type { TBox, TComponent } from './../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import MetaComponent from '../../../containers/MetaComponent';
import { updateComponentProperties } from '../../../reducers/LocalDataSlice';

type TProps = TBox & TCreateComponentFuncAsProp & Pick<ViewProps, 'style'>;

const MetaModal = (props: TProps) => {
   const dispatch = useDispatch();
   const { 
        componentProperties, componentId, components, isEditing,
        style, parentLayout, dataCellSuffix, dataCellRootId
    } = props;
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

   const onToggleModal = () => {
        dispatch(updateComponentProperties({
            uid: componentId, 
            key: 'is_hidden', 
            value: !componentProperties?.is_hidden
        }))
   }

   const ModalWrapper = isEditing ? View : Modal;

   return (
    <ModalWrapper
        onBackdropPress={onToggleModal}
        onBackButtonPress={onToggleModal}
        animationType='fade'
        transparent
        style={[style.layout, !isEditing ? { flex: 1 } : { height: Dimensions.get('window').height }]}
        visible={componentProperties?.is_hidden}>
            <View style={styles.outerContainer}>
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
                    parentLayout={parentLayout}/>)
            }
            {/* for absolute/relative positioning */}
            {backgroundChildren?.length > 0 &&
                <View key={'background'} style={[{ flex: 1 }]}>
                {
                    backgroundChildren
                        .sort((a: TComponent, b: TComponent) => a.order - b.order)
                        .map((child: TComponent) => <MetaComponent
                            dataCellRootId={dataCellRootId}
                            dataCellSuffix={dataCellSuffix}
                            key={child.uid}
                            componentId={child.uid}
                            parentId={componentId}
                            parentLayout={parentLayout}/>)
                }
                </View>
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
                        parentLayout={parentLayout}/>
                )
            }
            </View>
      </ModalWrapper>
   );
};

export default MetaModal;

const styles = StyleSheet.create({
    outerContainer: {
       flex: 1,
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: "#20202080",
    }
 });