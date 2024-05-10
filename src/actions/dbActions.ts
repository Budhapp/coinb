import { parseInlineLogic } from './../hooks/useInlineLogic';
import {
   dbCreateError,
   dbCreateSuccess,
   dbDeleteError,
   dbDeleteSuccess,
   dbReadError,
   dbReadSuccess,
   dbUpdateError,
   dbUpdateSuccess,
   dbUploadFileError,
   dbUploadFileSuccess,
   updateComponentData,
} from './../reducers/LocalDataSlice';
import uuid from 'react-native-uuid';

export function dbCreate(node: any, componentId: string, dataCellRootId: string) {
   return (dispatch: any, getState: any) => {
      const state: any = getState();
      const { assetType, data } = node.parameters;

      if(!data){
         console.log('Can`t create anything with empty data in component ' + componentId);
         return;
      }

      const parsedData = Object.keys(data).reduce((acc: Record<string, any>, key: string) => {
         acc[parseInlineLogic(state, key, componentId, dataCellRootId)] = parseInlineLogic(
            state,
            data[key],
            componentId,
            dataCellRootId
         );
         return acc;
      }, {});

      if(!parsedData?.id) {
         parsedData.id = uuid.v4();
      }

      const isEditing = state.project?.isEditing || false;
      const projectId = !isEditing ? state.project.projectId : `data/${state.project.projectId}/${assetType}` ;

      state.project
         .create(projectId, assetType, parsedData)
         .then((data: object) => {
            dispatch(dbCreateSuccess({assetType, data: parsedData}));
         })
         .catch((error: string) => {
            dispatch(dbCreateError(error));
         });
   };
}

export function dbRead(node: any, componentId: string) {
   return (dispatch: any, getState: any) => {
      const state: any = getState();
      const { comparator, key, value } = node.parameters.constraint;

      const isEditing = state.project?.isEditing || false;
      const projectId = !isEditing ? state.project.projectId : `data/${state.project.projectId}/${value}`;

      state.project
         .read(
            projectId,
            value, 
            node.parameters.constraint
         ).then((data: object) => {
            console.log('New data received', data)
            dispatch(dbReadSuccess({collection: value, data }));
            dispatch(updateComponentData({ uid: componentId, key: 'listData', value: value }));
         }).catch((error: string) => {
            dispatch(dbReadError(error));
         });
   };
}

export function dbUpdate(node: any, componentId: string, dataCellRootId: string) {
   return (dispatch: any, getState: any) => {
      const state: any = getState();

      const { assetId, assetType, data } = node.parameters;

      const calcAssetId = parseInlineLogic(
         state,
         assetId,
         componentId,
         dataCellRootId
         );

      const parsedData = Object.keys(data).reduce((acc: Record<string, any>, key: string) => {
         acc[parseInlineLogic(state, key, componentId, '')] = parseInlineLogic(
            state,
            data[key],
            componentId,
            dataCellRootId
         );
         return acc;
      }, {});

        const isEditing = state.project?.isEditing || false;
        const projectId = !isEditing ? state.project.projectId : `data/${state.project.projectId}/${assetType}`;
        state.project
            .update(projectId, assetType, calcAssetId, parsedData)
            .then((data: object) => {
                dispatch(dbUpdateSuccess({assetType, uid: calcAssetId, data: parsedData}));
            })
            .catch((error: string) => {
                dispatch(dbUpdateError({error}));
            });
   };
}

export function dbDelete(node: any, componentId: string, dataCellRootId: string) {
   return (dispatch: any, getState: any) => {
        const state: any = getState();

        const { assetId, assetType } = node.parameters;

        const calcAssetId = parseInlineLogic(
            state,
            assetId,
            componentId,
            dataCellRootId
        );

        const isEditing = state.project?.isEditing || false;
        const projectId = !isEditing ? state.project.projectId : `data/${state.project.projectId}/${assetType}`;

        state.project
            .delete(projectId, assetType, calcAssetId)
            .then((data: object) => {
                dispatch(dbDeleteSuccess({assetType, calcAssetId}));
            })
            .catch((error: string) => {
                dispatch(dbDeleteError(error));
            });
   };
}

export function dbUploadFile(node: any) {
   return (dispatch: any, getState: any) => {
      const state: any = getState();

      const { target, binary } = node.parameters;

      const isEditing = state.project?.isEditing || false;
      const projectId = !isEditing ? state.project.projectId : `data/${state.project.projectId}/${target}`;

      state.project
         .uploadFile(projectId, target, binary)
         .then((data: object) => {
            dispatch(dbUploadFileSuccess(node.parameters));
         })
         .catch((error: string) => {
            dispatch(dbUploadFileError(error));
         });
   };
}
