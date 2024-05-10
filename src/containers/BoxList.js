import { connect } from 'react-redux';

import { BoxList } from './../components';
import { updateComponentData, fetchStart } from './../reducers/LocalDataSlice';
import { runWorkflow } from './../reducers/WorkflowSlice';

function mapStateToProps(state, params) {
   const { componentId, dataCellSuffix, dataCellRootId } = params;
   const component = state.project?.definition?.components[componentId];
   const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;

   const dataCell = state.local?.components[dataCellRootId]?.properties?.dataCell || {};
   const dataName = state.local?.components[componentId]?.data?.listData || '';
   const componentData = state.local.globals[dataName] || {};
   const componentProperties = (state.local?.components[componentId]?.properties || []);
   const style = state.local?.components[uid]?.actualStyle || {};

   const components = component?.children ? component?.children.map((item) => {
      return state.project?.definition?.components[item]
   }) : [];

   return {
      ...params,
      uid,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      componentData,
      component,
      componentId,
      properties: componentProperties,
      components,
      style,
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {
      updateComponentData: (uid, key, value) => {
         dispatch(updateComponentData({ uid, key, value }));
      },
      runWorkflow: (componentId, workflow, dataCellRootId) => {
         // dispatch(fetchStart({key}))
         dispatch(runWorkflow(componentId, workflow, dataCellRootId));
      },
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoxList);
