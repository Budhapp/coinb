import { createSlice } from '@reduxjs/toolkit';
import { IComponentLogicFlow, ILogicNode } from './../types';
import _ from 'lodash';

import { setGlobalVar } from './GlobalsSlice';
import {
   fetchApi,
   scrollToElement,
   completeComponentWorkflow,
   updateComponentData,
   updateComponentProperties,
} from './LocalDataSlice';
import { dbCreate, dbDelete, dbRead, dbUpdate, dbUploadFile } from './../actions/dbActions';
import { navigateToPage } from './../actions/CommonActions';
import { parseInlineLogic } from './../hooks/useInlineLogic';
import { fetchModel } from './ProjectSlice';

function findNextActions(workflow: IComponentLogicFlow, currentId: string): ILogicNode[] {

   const { nodes = {}, connections = {}} = workflow;

   if (!(currentId in connections)) {
      return [];
   }
   const nodeIds: string[] = Object.keys(connections[currentId].success).filter(
      (nodeId) => !!nodeId
   );
   return nodeIds.map((nodeId: string) => {
      if (!(nodeId in nodes)) console.log('Node not found', nodeId, nodes);
      return nodes[nodeId];
   });
}

// thunk actions
export const runWorkflow =
   (componentId: string = '', workflow: IComponentLogicFlow = {}, dataCellRootId: string) =>
   async (dispatch: any, getState: any) => {
      const { nodes = {}, connections = {} } = workflow;
      const triggerNode: ILogicNode = Object.values(nodes).find((node: ILogicNode) => {
         return node.type.startsWith('trigger.') || node.type.startsWith('inline-entry.');
      });

      if (!triggerNode)
         return;

      if(_.isEmpty(connections))
         dispatch(runNode(workflow, triggerNode, {}, componentId, dataCellRootId));

      const nextNodes = findNextActions(workflow, triggerNode.uid);
      if (nextNodes.length > 1) {
         console.error('NO NO NO!');
      }
      if (nextNodes.length === 1) {
         dispatch(runNode(workflow, nextNodes[0], {}, componentId, dataCellRootId));
      }
   };

const runNode =
   (
      workflow: IComponentLogicFlow,
      node: ILogicNode,
      data: object,
      componentId: string,
      dataCellRootId: string,
   ) =>
   async (dispatch: any, getState: any) => {
      const tmpData = { ...data };

      const state = getState();

      switch (node.type) {
         case 'action.scrollToElement': {
            dispatch(scrollToElement({ uid: node.parameters.target }));
            break;
         }
         case 'action.setComponentData': {
            dispatch(updateComponentData({ 
               uid: node.parameters.target, 
               key: node.parameters.data, 
               value: node.parameters.value
            }));
            break;
         }
         case 'action.setComponentProperty': {
            dispatch(updateComponentProperties({ 
               uid: node.parameters.uid, 
               key: node.parameters.target, 
               value: node.parameters.value
            }));
            break;
         }
         case 'action.setGlobalVar': {
            dispatch(setGlobalVar(node.parameters));
            break;
         }
         case 'action.callAPI': {
            const {
               parameters: { body, headers, method, url },
            } = node;
            const params = {
               url: url ? parseInlineLogic(state, url, componentId, dataCellRootId) : undefined,
               body: body ? parseInlineLogic(state, body, componentId, dataCellRootId) : undefined,
               headers: headers ? parseInlineLogic(state, headers, componentId, dataCellRootId) : { 'Content-Type': 'application/json' },
               method: method || 'GET',
            };
            dispatch(fetchApi(params));
            break;
         }
         case 'action.updateSchema': {
            dispatch(fetchModel('dev'));
            break;
         }
         case 'action.dbCreate': {
            dispatch(dbCreate(node, componentId, dataCellRootId))
            break;
         }
         case 'action.navigate': {
            dispatch(navigateToPage(node.parameters.target, componentId))
            break;
         }
         case 'inline-entry.dbRead': {
            dispatch(dbRead(node, componentId))
            break;
         }
         case 'action.dbUpdate': {
            dispatch(dbUpdate(node, componentId, dataCellRootId))
            break;
         }
         case 'action.dbDelete': {
            dispatch(dbDelete(node, componentId, dataCellRootId))
            break;
         }
         case 'action.dbUploadFile': {
            dispatch(dbUploadFile(node))
            break;
         }
         default:
            break;
      }

      const nextNodes = findNextActions(workflow, node.uid);
      if (nextNodes.length > 1) {
         console.error('NO NO NO!');
      }

      if (nextNodes[0]) {
         dispatch(runNode(workflow, nextNodes[0], tmpData, componentId));
      }
      if (nextNodes.length === 0) {
         // console.log('workflow completed', workflow.uid);
         dispatch(completeComponentWorkflow({ uid: componentId, workflowId: workflow.uid }));
      }
   };

const workflowSlice = createSlice({
   name: 'workflow',
   initialState: {
      runningNodes: [],
      workflowData: {},
   },
   reducers: {},
});

export default workflowSlice.reducer;
