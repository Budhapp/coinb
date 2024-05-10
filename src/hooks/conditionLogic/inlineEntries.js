export function GetGlobalVar(state, params, node) {
   return state.globals[node.parameters.target];
}

export function GetComponent(state, params, node) {
   return node.parameters.target;
}

export function Litteral(state, params, node) {
   return node.parameters.value;
}

export function CurrentUser(state, params, node) {
   console.log('CurrentUser not implemented yet');
   return false;
}

export function GetPageData(state, params, node) {
   switch (node.parameters.target) {
      case 'Current Page Width':
         return state.local.page.width;
      default:
         return false;
   }
}

export function CallAPI(state, params, node) {
   const {
      parameters: { body, headers, method, path },
   } = node;
   return {
      url: path,
      params: {
         body: body || undefined,
         headers: headers || { 'Content-Type': 'application/json' },
         method: method || 'GET',
      },
   };
}
