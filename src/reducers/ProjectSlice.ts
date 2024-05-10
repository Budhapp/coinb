import { createSlice } from '@reduxjs/toolkit';
import { Tconstraint } from '../types/schema/queries';
import Constants from 'expo-constants';
import { realtimeDB, storage } from '../utils/service/clientFirebase';
import { Linking } from "react-native"

type TProjectSlice = {
   create: (assetType: string, data: Record<string, any>) => Promise<void>,
   read: (assetType: string, constraints: Tconstraint, view: Record<string, string>) => Promise<void>,
   update: (assetType: string, assetId: string, data: Record<string, any>) => Promise<void>,
   delete: (assetType: string, assetId: string) => Promise<void>,
   definition: Record<string, any>,
   loaded: boolean,
}

export const fetchModel = (envId: string) => async (dispatch: any, getState: any) => {
   const projectId = Constants?.expoConfig?.extra?.projectId || '???';

   const url: any = await Linking.getInitialURL();

   var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params: any = {},
      match;
   
   while (match = regex.exec(url)) {
      params[match[1]] = match[2];
   }
   
   const env = envId || 'prod';
   const projectDefinitionPromise = readData(`projects/${params['projectId'] || projectId}/${env}`);
   // get data indexes
   // const dataIndexesPromise = realtimeDB.readData(`project/${projectId}`);
   const [projectDefinition, dataIndexes] = await Promise.all([
      projectDefinitionPromise,
   ])

   dispatch(setProjectId(params['projectId'] || projectId));
   dispatch(setProjectDefinition(projectDefinition));
};

async function readData(path: string) {
   return realtimeDB.readData(path);
}

async function createFn(projectId: string, assetType: string, data: Record<string, any>) {
   return realtimeDB.create(projectId, assetType, data);
}

async function readFn(projectId: string, assetType: string, constraints: Tconstraint, view: Record<string, string>) {
   return realtimeDB.read(projectId, assetType, constraints, view);
}

async function updateFn(projectId: string, assetType: string, assetId: string, data: Record<string, any>) {
   return realtimeDB.update(projectId, assetType, assetId, data);
}

async function deleteFn(projectId: string, assetType: string, assetId: string) {
   return realtimeDB.delete(projectId, assetType, assetId);
}

const projectSlice = createSlice({
   name: 'project',
   initialState: {
   readData: readData,
   create: createFn,
   read: readFn,
   update: updateFn,
   delete: deleteFn,

   uploadFile: storage.uploadFile,
   downloadFile: storage.downloadFile,
   listFiles: storage.listFiles,
   deleteFile: storage.deleteFile,
   
   definition: {},
   loaded: false,
   isEditing: false,
   },
   reducers: {
      setProjectId: (state: TProjectSlice, action: { payload: Record<string, any> }) => {
         return { ...state, projectId: action.payload};
      },
      setProjectDefinition: (state: TProjectSlice, action: { payload: Record<string, any> }) => {
         return { ...state, definition: action.payload};
      },
      setProjectLoaded: (state: TProjectSlice, action: { payload: boolean }) => {
         return { ...state, loaded: action.payload};
      },
   }
});

export default projectSlice.reducer;
export const { setProjectDefinition, setProjectLoaded, setProjectId} = projectSlice.actions
