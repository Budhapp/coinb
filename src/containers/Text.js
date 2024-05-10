import React from 'react';
import { Text } from './../components';
import {connect} from 'react-redux';
import _ from 'lodash'
import { useInlineLogic } from './../hooks/useInlineLogic';

function mapStateToProps(state, params) {
  const { componentId, dataCellSuffix, dataCellRootId } = params;
  const component = state.project?.definition?.components[componentId];
  const uid = dataCellSuffix == undefined ? componentId : `${componentId}_${dataCellSuffix}`;
  const { properties: {text} = { text: ""}} = component;

  const dataCell = state.local?.components[dataCellRootId]?.properties?.dataCell || {};
  const calculatedText = state.local?.components[uid]?.properties?.calculated;
  const style = state.local?.components[uid]?.actualStyle || {};
  
  return {
    uid,
    text: calculatedText || text,
    dataCell,
    component,
    dataCellSuffix,
    dataCellRootId,
    style
  };
}

function mapDispatchToProps(dispatch) {
    // add methods here
  return {
    handleTextChanges: (text, uid, dataCellRootId) => { 
      if(text.includes('@@')) {
        dispatch(useInlineLogic(text, uid, dataCellRootId));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Text);
