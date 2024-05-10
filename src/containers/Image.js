import { connect } from 'react-redux';
import { Image } from './../components';
import { useInlineLogic } from './../hooks/useInlineLogic';

function mapStateToProps(state, params) {
   const { componentId, dataCellSuffix, dataCellRootId } = params;
   const component = state.project?.definition?.components[componentId];
   const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;
   const dataCell = state.local?.components[dataCellRootId]?.properties?.dataCell || {};
   const calculatedImage = state.local?.components[uid]?.properties?.calculated;
   const style = state.local?.components[uid]?.actualStyle || {};
   const { properties: { icon = undefined, image = '' } = {} } = component;

   return {
      uid,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      component,
      componentId,
      style,
      image: calculatedImage || image,
      icon
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {
      handleImageChanges: (image, uid, dataCellRootId) => { 
         if(image.includes('@@')) {
            dispatch(useInlineLogic(image, uid, dataCellRootId));
         }
       }
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(Image);
