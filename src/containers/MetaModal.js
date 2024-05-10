import { connect } from 'react-redux';

import { MetaModal } from '../components';

function mapStateToProps(state, params) {
   const { componentId, dataCellSuffix, dataCellRootId } = params;
   const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;
   const component = state.project?.definition?.components[componentId];
   const components = component?.children ? component?.children.map((item) => {
      return state.project?.definition?.components[item]
   }) : [];
   const dataCell = state.local?.components[dataCellRootId]?.properties?.dataCell || {};
   const componentProperties = (state.local?.components[componentId]?.properties || []);

   const isEditing = state.project?.isEditing || false;
   const style = state.local?.components[uid]?.actualStyle || {};
   

   return {
      uid,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      components,
      componentId,
      componentProperties,
      isEditing,
      style,
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaModal);
