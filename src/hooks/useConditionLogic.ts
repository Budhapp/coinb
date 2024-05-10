import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkflows } from './../utils/logic/triggerUtils';
import { TLocalData, updateComponentConditions, updateComponentVisualConditions } from './../reducers/LocalDataSlice';
import { deepEqual } from './../utils';
import {
   IComponentLogicFlow,
   ILogicNode,
   IInlineLogic,
   IInlineLogicNode,
   ILogicConnection,
   TComponentVisualLogic
} from './../types';
import { DataBaseContext } from './../types/schema/queries';
import { CurrentUser, CallAPI, GetComponent, GetGlobalVar, GetPageData, Litteral } from './conditionLogic/inlineEntries';
import { Comparison, GetAttribute, UnderDevelopment, GetLastItem, Combination, GetProperty, Contains} from './conditionLogic/inlineNodes';

export function useConditionLogic(logic: Record<string, IComponentLogicFlow>, componentId: string) {
   return (dispatch: any, getState: any) =>
   {
      const state = getState();
      const conditionalWorkflows = getWorkflows(logic, 'trigger.condition');
      const project = state.project;
      const local = state.local;
      const globals = state.globals;
   
      if (conditionalWorkflows.length > 0 && project.definition) {
         const conditions = conditionalWorkflows.reduce(
            (acc: Record<string, boolean>, logicWorkflow: IComponentLogicFlow) => {
               const conditionTriggers = Object.values(logicWorkflow.nodes || {})
                  .filter((node: ILogicNode) => 'type' in node && node.type === 'trigger.condition');
   
               if (conditionTriggers.length > 1) {
                  console.error('Multiple condition triggers not supported yet');
               }
               const condition: ILogicNode = conditionTriggers[0];
               if ('parameters' in condition && 'expression' in condition.parameters) {
                  acc[logicWorkflow.uid] = resolveInlineLogic(condition.parameters.expression, { local, globals }) == true
               }
               return acc;
            },
            {}
         );
         if (!deepEqual(local.components[componentId]?.conditions || {}, conditions)) {
            dispatch(updateComponentConditions({ uid: componentId, conditions }))
         }
      }
   }
}


export function useVisualLogic(visualLogic: TComponentVisualLogic[], componentId: string) {
   return (dispatch: any, getState: any) =>
   {
      const state = getState();
      const project = state.project;
      const local = state.local;
      const globals = state.globals;
   
      try{
         if (visualLogic.length > 0 && project.definition) {
            const conditions = visualLogic.map(
               (logic: TComponentVisualLogic) => {
                  return resolveInlineLogic(logic.condition, { local, globals }) == true
               }
            );
            if (!deepEqual(local.components[componentId]?.visualConditions || [], conditions)) {
               dispatch(updateComponentVisualConditions({ uid: componentId, conditions }))
            }
         }
      }
      catch(ex)
      {
         console.log(ex)
      }
   }
}

export const resolveInlineLogic = (
   expression: IInlineLogic,
   state: {
      local: TLocalData,
      globals: Record<string, any>
   },
   debug: boolean = false
) => {
   const { nodes, connections } = expression;

   const entrypoints: IInlineLogicNode[] = Object.values(nodes).filter((node: IInlineLogicNode) => node.type.startsWith('inline-entry.'));
   const executionStack: IInlineLogicNode[] = entrypoints;

   const scheduleNext = (nodeId: string) => {
      try {
         if (nodeId in connections) {
            const keysOfNextNodes = Object.keys(connections[nodeId].success);
            keysOfNextNodes.forEach((key) => {
               executionStack.push(nodes[key]);
            })
         }
      }
      catch (ex) {
         console.error('Error scheduling next inline action', ex)
      }
   }

   try {
      const data: Record<string, any> = {};
      let result;
      while (executionStack.length > 0) {
         const node = executionStack.shift();
         const inboundNodes = Object.keys(connections)
            .filter((connectionId: string) =>
               Object.keys(connections[connectionId].success).some((c: ILogicConnection) => {
                  return node.uid === c
               })
            );
         const nodeParams = inboundNodes.filter((nodeId: string) => nodeId in data).map((nodeId: string) => data[nodeId])
         if (nodeParams.length !== inboundNodes.length) {
            executionStack.push(node);
            continue;
         }
         const res = executeInlineNode(node, nodeParams, state);
         if (node.uid in connections) {
            scheduleNext(node.uid);
            data[node.uid] = res;
         } else {
            result = res;
         }
      }
      return result
   } catch (ex) {
      console.error('Error', ex)
      return false
   }
}

const executeInlineNode = (
   node: IInlineLogicNode,
   params: any[],
   state: { local: TLocalData, globals: Record<string, any> },
) => {
   if (!('type' in node)) {
      console.warn('Node type not defined', node)
      return false;
   }
   switch (node.type) {
      // TODO: implement all inline entries
      case 'inline-entry.GetGlobalVar':
         return GetGlobalVar(state, params, node);
      case 'inline-entry.GetComponent':
         return GetComponent(state, params, node);
      case 'inline-entry.Litteral':
         return Litteral(state, params, node);
      case 'inline-node.GetProperty':
         return GetProperty(state, params, node);
      case 'inline-entry.CurrentUser':
         return CurrentUser(state, params, node);
      case 'inline-entry.GetPageData':
         return GetPageData(state, params, node);
      case 'inline-node.GetAttribute':
         return GetAttribute(state, params, node);
      case 'inline-node.Comparison': 
         return Comparison(state, params, node);
      case 'inline-node.GetLastItem':
         return GetLastItem(state, params, node);
      case 'inline-node.Contains':
         return Contains(state, params, node);
      case 'inline-node.Combination':
         return Combination(state, params, node);
      case 'action.CallAPI': 
         return CallAPI(state, params, node);
      case 'inline-node.UnderDevelopment': 
         return UnderDevelopment(state, params, node);
      default:
         return false;
   }
}