export function getWorkflows(logic = {}, type) {
   return Object.values(logic)
      .filter((logicWorkflow) => {
         return Object.values(logicWorkflow.nodes || {}).filter((node) => node.type === type).length > 0;
      })
}
