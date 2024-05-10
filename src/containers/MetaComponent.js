import { connect } from 'react-redux';

import { useConditionLogic, useVisualLogic } from './../hooks/useConditionLogic';
import MetaComponent from '../components/base/MetaComponent';

function mapStateToProps(state, params) {
   const { componentId, parentId, dataCell, dataCellSuffix, dataCellRootId, parentStyle } = params;

   const { components, design_system } = state.project?.definition;
   const component = components[componentId];
   
   const {
      style = '', 
      properties = {},
      logic = {},
      visual_logic = {},
      custom_styling = {},
      composite_key,
      uid,
      data: componentData = {},
   } = component || {};

   const designSystemStyle = design_system?.user_styles ? design_system?.user_styles[style] : {};
   const colours = design_system?.colours;
   const fonts = design_system?.fonts;
   const responsiveFactor = design_system?.responsive_factor;
   
   const visualConditions = state.local?.components[uid]?.visualConditions || Object.keys(visual_logic).map((_) => false);
   const conditionalWorkflowIds = (state.local?.components[uid]?.pendingWorkflowIds || []);
   const localProperties = state.local?.components[uid]?.properties || [];
   const initialStyle = state.local?.components[uid]?.initialStyle || {};
   const actualStyle = state.local?.components[uid]?.actualStyle || {};

   const currentPage = state.local?.page;

   const visualLogic = {
      '0': {
         condition: {
            nodes: {
               node_selected: {
                  uid: 'node_selected',
                  name: 'Get global variable',
                  type: 'inline-entry.GetGlobalVar',
                  parameters: {
                     target: 'selected',
                  },
               },
               node_last_item: {
                  uid: 'node_last_item',
                  name: 'Get last item',
                  type: 'inline-node.GetLastItem',
                  parameters: {},
               },
               node_local_uid: {
                  uid: 'node_local_uid',
                  name: "This Component's uid",
                  type: 'inline-entry.Litteral',
                  parameters: {
                     value: uid,
                  },
               },
               node_equal: {
                  uid: 'node_equal',
                  name: ' == ',
                  type: 'inline-node.Comparison',
                  parameters: {
                     comparator: '=',
                  },
               },
            },
            connections: {
               node_selected: {
                  success: {
                     node_last_item: {
                        order: 0,
                     },
                  },
               },
               node_last_item: {
                  success: {
                     node_equal: {
                        order: 0,
                     },
                  },
               },
               node_local_uid: {
                  success: {
                     node_equal: {
                        order: 0,
                     },
                  },
               },
            },
         },
         styling: {
            border: {
               top: {
                  width: { val: 1, unit: 'px' },
                  style: 'solid',
               color: 'red',
               },
               right: {
                  width: { val: 1, unit: 'px' },
                  style: 'solid',
                  color: 'red',
               },
               bottom: {
                  width: { val: 1, unit: 'px' },
                  style: 'solid',
                  color: 'red',
               },
               left: {
                  width: { val: 1, unit: 'px' },
                  style: 'solid',
                  color: 'red',
               },
            },
         },
      },
      '1': {
         condition: {
            nodes: {
               node_selected: {
                  uid: 'node_selected',
                  name: 'Get global variable',
                  type: 'inline-entry.GetGlobalVar',
                  parameters: {
                     target: 'selected',
                  },
               },
               node_contains: {
                  uid: 'node_contains',
                  name: 'Get last item',
                  type: 'inline-node.Contains',
                  parameters: {
                     value: uid
                  },
               },
            },
            connections: {
               node_selected: {
                  success: {
                     node_contains: {
                        order: 0,
                     },
                  },
               },
            },
         },
         properties: {
            is_hidden: false,
         },
      }
   };

   const isEditing = state.project?.isEditing || false;

   if (isEditing) {
      return {
         // ...params,
         isEditing,
         custom_styling,
         designSystemStyle,
         colours,
         fonts,
         responsiveFactor,
         conditionalWorkflowIds,
         visualConditions,
         properties,
         localProperties,
         initialStyle,
         actualStyle,
         component,
         componentId,
         componentData: {},
         currentPage,
         dataCell,
         dataCellSuffix,
         dataCellRootId,
         parentStyle,
         logic: {
            ['editor_selection_' + uid]: {
               uid: 'editor_selection_' + uid,
               nodes: {
                  trigger: {
                     uid: 'trigger',
                     name: 'On press',
                     type: 'trigger.onClick',
                  },
                  select_node: {
                     uid: 'select_node',
                     name: 'Select component ' + uid,
                     type: 'action.setGlobalVar',
                     parameters: {
                        key: 'selected',
                        value: composite_key,
                     },
                  },
               },
               connections: {
                  trigger: {
                     success: {
                        select_node: {
                           order: 0,
                           to: 'select_node',
                           uid: 'select_node',
                        },
                     },
                  },
               },
            },
         },
         visual_logic: visualLogic,
      }
   } 
   return {
      // ...params,
      isEditing,
      logic,
      visual_logic,
      custom_styling,
      designSystemStyle,
      properties,
      localProperties,
      initialStyle,
      actualStyle,
      colours,
      fonts,
      responsiveFactor,
      conditionalWorkflowIds,
      visualConditions,
      componentData,
      component,
      componentId,
      currentPage,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      parentStyle
   };
}

function mapDispatchToProps(dispatch) {
   // add methods here
   return {
      triggerConditionLogic: (logic, uid) => {
         dispatch(useConditionLogic(logic, uid));
      },
      triggerVisualLogic: (logic, uid) => {
         dispatch(useVisualLogic(logic, uid));
      },
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaComponent);