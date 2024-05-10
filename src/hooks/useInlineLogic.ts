import { IInlineLogic, IInlineLogicNode, ILogicConnection } from 'src/types/schema/logic';

import { TLocalData, updateComponentProperties } from './../reducers/LocalDataSlice';
import { GetGlobalVar } from './conditionLogic/inlineEntries';

export function useInlineLogic(text: string, componentId: string, dataCellRootId: string) {
   return (dispatch: any, getState: any) => {
      try {
         dispatch(
            updateComponentProperties({
               uid: componentId,
               key: 'calculated',
               value: parseInlineLogic(getState(), text, componentId, dataCellRootId),
            })
         );
      } catch (ex) {
         console.error('Error calculating inline logic in', componentId, ex);
         return text;
      }
   };
}

export function parseInlineLogic(
   state: Record<string, any>,
   text: string,
   componentId: string,
   dataCellRootId: string
) {
   if (!text) return '';

   let result = text;

   const local = state.local;
   const globals = state.globals;
   const regex = /(@@[\w\W]*@@)/;
   const parts = text.split(regex);

   if (parts.length > 1) {
      result = parts
         .map((part, index) => {
            if (part.match(regex)) {
               try {
                  const jsonText: any = part.match(/@@(.*?)@@/);
                  return resolveInlineLogic(
                     JSON.parse(jsonText[1]),
                     { local, globals },
                     componentId,
                     dataCellRootId
                  );
               } catch (ex) {
                  console.log(ex);
               }
            }
            return part;
         })
         .join('');
   }

   return result;
}

export const resolveInlineLogic = (
   expression: IInlineLogic,
   state: {
      local: TLocalData;
      globals: Record<string, any>;
   },
   componentId: string,
   dataCellRootId: string
) => {
   const { nodes, connections } = expression;

   const entrypoints: IInlineLogicNode[] = Object.values(nodes).filter((node: IInlineLogicNode) =>
      node.type.startsWith('inline-entry.')
   );
   const executionStack: IInlineLogicNode[] = entrypoints;

   const scheduleNext = (nodeId: string) => {
      try {
         if (nodeId in connections) {
            const keysOfNextNodes = Object.keys(connections[nodeId].success);
            keysOfNextNodes.forEach((key) => {
               executionStack.push(nodes[key]);
            });
         }
      } catch (ex) {
         console.error('Error scheduling next inline action', ex);
      }
   };

   try {
      const data: Record<string, any> = {};
      let result;
      while (executionStack.length > 0) {
         const node = executionStack.shift();
         const inboundNodes = Object.keys(connections).filter((connectionId: string) =>
            Object.keys(connections[connectionId].success).some((c: any) => {
               return node?.uid === c;
            })
         );
         const nodeParams = inboundNodes
            .filter((nodeId: string) => nodeId in data)
            .map((nodeId: string) => data[nodeId]);
         if (nodeParams.length !== inboundNodes.length) {
            executionStack.push(node);
            continue;
         }
         const res = executeInlineNode(node, nodeParams, state, componentId, dataCellRootId);
         if (node.uid in connections) {
            scheduleNext(node.uid);
            data[node.uid] = res;
         } else {
            result = res;
         }
      }
      return result;
   } catch (ex) {
      console.error('Error', ex);
      return false;
   }
};

const executeInlineNode = (
   node: IInlineLogicNode,
   params: any[],
   state: { local: TLocalData; globals: Record<string, any> },
   componentId: string,
   dataCellRootId: string
) => {
   if (!('type' in node)) {
      console.warn('Node type not defined', node);
      return false;
   }
   switch (node.type) {
      // TODO: implement all inline entries
      case 'inline-entry.GetGlobalVar':
         return GetGlobalVar(state, params, node);
      case 'inline-entry.GetComponent':
         return node.parameters.target;
      case 'inline-entry.Litteral':
         return node.parameters.value;
      case 'inline-node.GetProperty': {
         let index = undefined;

         if (dataCellRootId) index = dataCellRootId.split('_').pop();

         return state.local.components[index ? `${params[0]}_${index}` : params[0]]?.properties[
            node.parameters.target
         ];
      }
      case 'inline-node.GetComponentData': {
         let index = undefined;

         if (dataCellRootId) index = dataCellRootId.split('_').pop();

         return state.local.components[index ? `${params[0]}_${index}` : params[0]]?.data[
            node.parameters.target
         ];
      }
      case 'inline-entry.CurrentUser':
         console.log('CurrentUser not implemented yet');
         return false;
      case 'inline-entry.GetPageData':
         switch (node.parameters.target) {
            case 'Current Page Width':
               return state.local.page.width;
            default:
               return false;
         }
      case 'inline-node.GetAttribute':
         return state.local.components[params[0]]?.properties[node.parameters.target];
      case 'inline-entry.GetCurrentCellItem':
         return (
            state.local.components[dataCellRootId]?.properties?.dataCell[node.parameters.target] ||
            ''
         );
      case 'inline-node.Comparison': {
         const [left, right] = params;
         switch (node.parameters.comparator) {
            case '=':
               return left === right;
            case '!=':
               return left !== right;
            case '>':
               return left > right;
            case '<':
               return left < right;
            case '>=':
               return left >= right;
            case '<=':
               return left <= right;
            default:
               console.warn('Unhandled comparator', node.parameters.comparator);
               return false;
         }
      }
      case 'inline-node.GetLastItem': {
         if (Array.isArray(params[0]) && params[0].length > 0) {
            return params[0][params[0].length - 1];
         }
         return undefined;
      }
      case 'inline-node.Contains': {
         return params[0].includes(node.parameters.value);
      }
      case 'action.CallAPI': {
         const {
            parameters: { body, headers, method, path },
         } = node;
         return {
            url: path,
            params: {
               body: body ? parseInlineLogic(state, body, componentId, dataCellRootId) : undefined,
               headers: headers ? parseInlineLogic(state, headers, componentId, dataCellRootId) : { 'Content-Type': 'application/json' },
               method: method || 'GET',
            },
         };
      }
      default:
         return false;
   }
};
