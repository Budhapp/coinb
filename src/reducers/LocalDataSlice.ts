import { createSlice } from '@reduxjs/toolkit';
import { addObjectKeyByUid } from './../utils/nodeHelper';
import { deepEqual, safeMergeObjects } from './../utils/index';
import { fetchUrl } from './../utils/fetch/fetchUserData';


export type TLocalData = {
   loaded: boolean,
   components: Record<string, TComponentState>,
   pages: any,
   scrollPosition: {
      x: number,
      y: number
   },
   globals: Record<string, TComponentState>,
   userData: object,
   page: {
      width: number,
      height: number,
      top: number,
      view: 'xl' | 'web' | 'tablet' | 'mobile'
   }
}
type TComponentState = {
   index: string[],
   dataCell: any,
   data: Record<string, any>,
   properties: Record<string, any>,
   initialStyle: Record<string, any>,
   actualStyle: Record<string, any>,
   conditions: Record<string, boolean>,
   visualConditions: boolean[],
   pendingWorkflowIds?: string[],
   layout: {
      width: number,
      height: number,
      top: number,
   }
}

const defaultComponent = {
   data: {},
   properties: {},
   conditions: {},
   visualConditions: [],
   pendingWorkflowIds: [],
   layout: {
      width: -1,
      height: -1,
      top: -1,
   }
}

export const fetchApi = (params: any) => async (dispatch: any, getState: any) => {
   return await fetchUrl(params);
};

const localDataSlice = createSlice({
   name: 'local',
   initialState: {
      loaded: false,
      components: {},
      pages: {},
      scrollPosition: {
         x: 0,
         y: 0
      },
      page: {
         width: 0,
         height: 0,
         view: 'web'
      },
      globals: {},
      // userData: {}
   },
   reducers: {
      setPage: (state: TLocalData, action: any) => {
         const { uid, page, navigation }: { uid: string, page: any, navigation: any } = action.payload;
         
         return {
            ...state,
            pages: {
               ...state.pages,
               [`page_${uid}`]: {
                  ...page,
                  navigation
               }
            }
         }
      },
      setComponent: (state: TLocalData, action: any) => {
         const { uid, component, parentId }: { uid: string, component: TComponentState, parentId: string } = action.payload;
         if (deepEqual(state.components[uid], component)) {
            return state
         }
         const index = (parentId in state.components) ? state.components[parentId].index : [parentId]
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...defaultComponent,
                  index: [...index, uid],
                  ...component
               }
            }
         }
      },
      updateComponent: (state: TLocalData, action: any) => {
         const { uid, component }: { uid: string, component: TComponentState } = action.payload;
         if (deepEqual(state.components[uid], component)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...defaultComponent,
                  ...safeMergeObjects(state.components[uid], component)
               }
            }
         }
      },
      updateComponentVisualConditions: (state: TLocalData, action: any) => {
         const { uid, conditions }: { uid: string, conditions: boolean[] } = action.payload;
         if (deepEqual(state.components[uid]?.visualConditions, conditions)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  visualConditions: conditions
               }
            }
         }
      },
      updateComponentConditions: (state: TLocalData, action: any) => {
         const { uid, conditions }: { uid: string, conditions: Record<string, boolean> } = action.payload;
         const previousConditions = state.components[uid]?.conditions || {}
         if (deepEqual(conditions, previousConditions)) {
            return state
         }
         const workflowsToTrigger = []
         for (const workflowId of Object.keys(conditions)) {
            if (conditions[workflowId] !== previousConditions[workflowId]) {
               if (conditions[workflowId]) {
                  workflowsToTrigger.push(workflowId)
               } else {
                  // How to stop passive effects?
               }
            }
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  conditions: safeMergeObjects(previousConditions, conditions),
                  pendingWorkflowIds: workflowsToTrigger
               }
            }
         }
      },
      completeComponentWorkflow: (state: TLocalData, action: any) => {
         const { uid, workflowId }: { uid: string, workflowId: string } = action.payload;
         state.components[uid].pendingWorkflowIds = state.components[uid].pendingWorkflowIds.filter(id => id !== workflowId)
      },
      updateComponentLayout: (state: TLocalData, action) => {
         const { uid, layout }: { uid: string, layout: any } = action.payload;
         if (deepEqual(state.components[uid]?.layout, layout)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  layout: {
                     ...state.components[uid]?.layout,
                     ...layout
                  }
               }
            }
         }
      },
      updateAllComponentProperties: (state: TLocalData, action: any) => {
         const { uid, props }: { uid: string, props: any } = action.payload;
         if (deepEqual(state.components[uid]?.properties, props)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  properties: {
                     ...props
                  }
               }
            }
         }
      },
      updateComponentProperties: (state: TLocalData, action: any) => {
         const { uid, key, value }: { uid: string, key: string, value: any } = action.payload;
         if (deepEqual(state.components[uid]?.properties[key], value)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  properties: {
                     ...state.components[uid]?.properties,
                     [key]: value
                  }
               }
            }
         }
      },
      updateComponentData: (state: TLocalData, action: any): TLocalData => {
         const { uid, key, value }: { uid: string, key: string, value: any } = action.payload;
         if (deepEqual(state.components[uid]?.data[key], value)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  data: {
                     ...state.components[uid]?.data,
                     [key]: value
                  }
               }
            }
         }
      },
      initComponentStyling: (state: TLocalData, action: any): TLocalData => {
         const { uid, value }: { uid: string, value: any } = action.payload;
         if (deepEqual(state.components[uid]?.initialStyle, value)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  initialStyle: {
                     ...value
                  },
                  actualStyle: {
                     ...value
                  }
               }
            }
         }
      },
      updateComponentStyling: (state: TLocalData, action: any): TLocalData => {
         const { uid, value }: { uid: string, value: any } = action.payload;
         if (deepEqual(state.components[uid]?.actualStyle, value)) {
            return state
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  actualStyle: {
                     ...value
                  }
               }
            }
         }
      },
      updateInitialStyling: (state: TLocalData, action: any): TLocalData => {
         const { uid, value }: { uid: string, value: any } = action.payload;
         if (deepEqual(state.components[uid]?.initialStyle, value)) {
            return state;
         }
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: {
                  ...state.components[uid],
                  initialStyle: {
                     ...value
                  }
               }
            }
         }
      },
      componentsLoaded: (state: TLocalData) => {
         return {
            ...state,
            loaded: true
         }
      },
      addScrollComponent: (state: TLocalData, action: any) => {
         const { uid, component }: { uid: string, component: TComponentState } = action.payload;
         return {
            ...state,
            components: {
               ...state.components,
               [uid]: { ...defaultComponent, ...component }
            }
         }
      },
      scrollToElement: (state: TLocalData, action: any) => {
         const { uid } = action.payload;

         const { top, left } = state.components[uid]?.layout;
         let scroll = state.components['rootScroll'];
         console.log(top);
         scroll.scrollTo({ x: left, y: top, animated: true })
         // return {...state, scrollPosition: state.components[uid]?.layout};
      },
      updatePageLayout: (state: TLocalData, action) => {
         const { width, height, x }: { width: number, height: number, x?: number, y?: number } = action.payload;
         if (state.page.width === width && state.page.height === height && state.page.top === x) {
            return state
         }
         return {
            ...state,
            page: {
               ...state.page,
               width,
               height,
               top: x,
               view: width > 1440 ? 'xl'
                  : width > 992 ? 'web'
                     : width > 768 ? 'tablet'
                        : 'mobile'
            }
         }
      },
      fetchStart: (state: TLocalData, action: any) => {
         const { key }: { key: string } = action.payload;
         
         return {
            ...state,
            components: {
               ...state.components,
               [key]: {
                  ...state.components[key],
                  data: {
                     ...state.components[key]?.data,
                     listData: {
                        loading: true,
                        data: null,
                        error: null,
                     }
                  }
               }
            }
         }
      },
      fetchDataBegin: (state: TLocalData, action: any) => {
         const { key }: { key: string } = action.payload;
         
         return {
            ...state,
            components: {
               ...state.components,
               [key]: {
                  ...state.components[key],
                  data: {
                     ...state.components[key]?.data,
                     listData: {
                        loading: true,
                        data: null,
                        error: null,
                     }
                  }
               }
            }
         }
      },
      fetchDataSuccess: (state: TLocalData, action: any) => {
         const { key, data }: { key: string, data: any } = action.payload;
         
         return {
            ...state,
            components: {
               ...state.components,
               [key]: {
                  ...state.components[key],
                  data: {
                     ...state.components[key]?.data,
                     listData: {
                        loading: false,
                        data: data,
                        error: null,
                     }
                  }
               }
            }
         }
      },
      fetchDataError: (state: TLocalData, action: any) => {
         const { key, error }: { key: string, error: any } = action.payload;
         
         return {
            ...state,
            components: {
               ...state.components,
               [key]: {
                  ...state.components[key],
                  data: {
                     ...state.components[key]?.data,
                     listData: {
                        loading: false,
                        error: error,
                     }
                  }
               }
            }
         }
      },
      dbCreateSuccess: (state: TLocalData, action: any) => {
         const { assetType, data }: { assetType: string, data: Record<string, any> } = action.payload;

         const { id } = data;
         
         return {
            ...state,
            globals: {
               ...state.globals,
               [assetType]: {
                  ...state.globals[assetType],
                  [id]: data
               }
            }
         }
      },
      dbCreateError: (state: TLocalData, action: any) => {
         const { path, error }: { path: string, error: string } = action.payload;
         
         return {
            ...state,
         }
      },
      dbReadSuccess: (state: TLocalData, action: any) => {
         const { collection, data }: { collection: string, data: Record<string, any> } = action.payload;
         
         return {
            ...state,
            globals: {
               ...state.globals,
               [collection]: data
            }
         }
      },
      dbReadError: (state: TLocalData, action: any) => {
         const { path, error }: { path: string, error: string } = action.payload;
         
         return {
            ...state
         }
      },
      dbUpdateSuccess: (state: TLocalData, action: any) => {
         const {assetType, uid, data }: { assetType: any, uid: any, data: Record<string, any> } = action.payload;
         
         return {
            ...state,
            globals: {
               ...state.globals,
               [assetType]: {
                  ...state.globals[assetType],
                  [uid]:{
                     ...state.globals[assetType][uid],
                     ...data
                  }

               }
            }
         }
      },
      dbUpdateError: (state: TLocalData, action: any) => {
         const { path, error }: { path: string, error: string } = action.payload;
         
         return {
            ...state
         }
      },
      dbDeleteSuccess: (state: TLocalData, action: any) => {
         const { assetType, uid }: { assetType: string, uid: string } = action.payload;
         
         let assetData = {...state.globals[assetType]};
         delete assetData[uid];
         return {
            ...state,
            // TODO add deep update for CRUD in globals 
            globals: {
               ...state.globals,
               [assetType]: {...assetData}
            }
         }
      },
      dbDeleteError: (state: TLocalData, action: any) => {
         const { path, error }: { path: string, error: string } = action.payload;
         
         return {
            ...state,
            // TODO add deep update for CRUD in globals 
            globals: {
               ...state.globals,
               [path]: {
                  data: undefined,
                  loading: false,
                  error: error,
               }
            }
         }
      },
      dbUploadFileSuccess: (state: TLocalData, action: any) => {
         const { path, data }: { path: string, data: object } = action.payload;
         
         return {
            ...state,
            // TODO add deep update for CRUD in globals 
            globals: {
               ...state.globals,
               [path]: {
                  data: data,
                  loading: true,
                  error: null,
               }
            }
         }
      },
      dbUploadFileError: (state: TLocalData, action: any) => {
         const { path, error }: { path: string, error: string } = action.payload;
         
         return {
            ...state,
            // TODO add deep update for CRUD in globals 
            globals: {
               ...state.globals,
               [path]: {
                  data: undefined,
                  loading: false,
                  error: error,
               }
            }
         }
      },
   }
});

export default localDataSlice.reducer;
export const {
   addComponent, setComponent, updateComponent, setPage, initComponentStyling, updateComponentStyling,
   updateComponentVisualConditions, updateComponentConditions, completeComponentWorkflow,
   updateComponentLayout, updateComponentProperties, updateAllComponentProperties, updateComponentData,
   addScrollComponent, scrollToElement, componentsLoaded, updatePageLayout, updateInitialStyling,
   fetchStart, fetchDataBegin, fetchDataSuccess, fetchDataError,
   dbCreateSuccess, dbCreateError, dbReadSuccess, dbReadError,
   dbUpdateSuccess, dbUpdateError, dbDeleteSuccess, dbDeleteError,
   dbUploadFileSuccess, dbUploadFileError,
    
} = localDataSlice.actions
