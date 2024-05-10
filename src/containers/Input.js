import _ from 'lodash';
import { connect } from 'react-redux';

import { Input } from './../components';
import { useInlineLogic } from './../hooks/useInlineLogic';

function mapStateToProps(state, params) {
   const { componentId, dataCellSuffix, dataCellRootId } = params;
   const component = state.project?.definition?.components[componentId];
   const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;

   const dataCell = state.local?.components[dataCellRootId]?.properties?.dataCell || {};
   const componentData = state.local?.components[uid]?.data || {};
   const componentProperties = state.local?.components[uid]?.properties || {};
   const calculatedValue = state.local?.components[uid]?.properties?.calculated;
   const style = state.local?.components[uid]?.actualStyle || {};

   return {
      uid,
      dataCell,
      component,
      componentId,
      dataCellSuffix,
      dataCellRootId,
      componentData,
      componentProperties,
      style,
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {
      handleValueChanges: (text, uid, dataCellRootId) => {
         dispatch(useInlineLogic(text, uid, dataCellRootId));
      },
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(Input);
