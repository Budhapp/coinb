import { connect } from 'react-redux';

import Chart from './../components/base/Chart';

function mapStateToProps(state, params) {
   const { componentId, dataCellSuffix, dataCellRootId } = params;
   const properties = state.project?.definition?.components[componentId]?.properties || [];
   const component = state.project?.definition?.components[componentId];
   const style = state.local?.components[uid]?.actualStyle || {};

   return {
      properties,
      component,
      componentId,
      style
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
