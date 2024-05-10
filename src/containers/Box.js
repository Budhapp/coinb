import { connect } from 'react-redux';

import { Box } from './../components';

function mapStateToProps(state, params) {
   const { componentId, dataCellSuffix, dataCellRootId, parentId} = params;
   const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;
   const component = state.project?.definition?.components[componentId];
   const components = component?.children ? component?.children.map((item) => {
      return state.project?.definition?.components[item]
   }) : [];
   const dataCell = state.local?.components[dataCellRootId]?.properties?.dataCell || {};
   const style = state.local?.components[uid]?.actualStyle || {};

   return {
      uid,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      components,
      componentId,
      style
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Box);
