// Import the functions you need from the SDKs you need
import { Tconstraint } from '../../types/schema/queries';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import {
   getAuth,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   confirmPasswordReset,
   updateProfile,
   User,
} from 'firebase/auth';
import { getDatabase, ref, child, get, set, update, remove } from 'firebase/database';
import {
   getStorage,
   deleteObject,
   ref as sref,
   listAll,
   uploadBytes,
   getDownloadURL,
} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const projectId = Constants?.expoConfig?.extra?.projectId || '???';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: 'AIzaSyBRXQgNDhJOHKL6U40LMPd9LkfBq9to754',
   authDomain: 'budhapp-94298.firebaseapp.com',
   projectId: 'budhapp-94298',
   storageBucket: 'budhapp-94298.appspot.com',
   messagingSenderId: '804256063936',
   appId: '1:804256063936:web:509d13b5d829b6d2dfa825',
   measurementId: 'G-KGWK6HF09N',
   databaseURL: 'https://budhapp-94298-default-rtdb.europe-west1.firebasedatabase.app',
};

// Initialize Firebase
// console.log('Initializing Firebase...')
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
const login = async (email: string, password: string) =>
   signInWithEmailAndPassword(auth, email, password);
const register = async (email: string, password: string) =>
   createUserWithEmailAndPassword(auth, email, password);
const logout = async () => signOut(auth);
const resetPassword = async (securityCode: string, newPassword: string) =>
   confirmPasswordReset(auth, securityCode, newPassword);
const sendPasswordResetCode = async (email: string, callbackUrl: string) => {
   const actionCodeSettings = {
      url: callbackUrl,
      // url: 'https://www.example.com/?email=user@example.com', // custom url
      iOS: {
         bundleId: 'com.example.ios',
      },
      android: {
         packageName: 'com.example.android',
         installApp: true,
         minimumVersion: '12',
      },
      handleCodeInApp: true,
   };
   return sendPasswordResetEmail(auth, email, actionCodeSettings);
};
const updateUserProfile = async (user: User, payload: any) => updateProfile(user, payload);
export const firebaseAuth = {
   login,
   register,
   logout,
   sendPasswordResetCode,
   resetPassword,
   updateUserProfile,
};

// Realtime DB
const _realtimeDB = getDatabase(app);
// console.log('Realtime DB initialized', _realtimeDB)
const readData = async (path: string) => {
   const snapshot = await get(child(ref(_realtimeDB), path));
   if (snapshot.exists()) {
      return snapshot.val();
   }
   return null;
};

// const followData = (path, callback) =>
//    onValue(ref(_realtimeDB, path), (snapshot) => {
//       if (snapshot.exists()) {
//          callback(snapshot.val());
//       }
//    });

const createRealtimeDB = async (projectId: string, assetType: string, data: Record<string, any>) => {
   const path = `data/${projectId}/${assetType}/${data.id}`;
   return set(ref(_realtimeDB, path), data);
};

const readRealtimeDB = async (
   projectId: string,
   assetType: string,
   constraints: Tconstraint,
   view: Record<string, string>
) => {
   // TODO: Add constraints
   const path = `data/${projectId}/${assetType}`;
   const snapshot = await get(child(ref(_realtimeDB), path));
   if (snapshot.exists()) {
      return snapshot.val();
   }
   return null;
};
const updateRealtimeDB = async (projectId: string, assetType: string, assetId: string, data: Record<string, any>) => {
   const path = `data/${projectId}/${assetType}/${assetId}`;
   return update(ref(_realtimeDB, path), data);
};
const deleteRealtimeDB = async (projectId: string, assetType: string, assetId: string) => {
   const path = `data/${projectId}/${assetType}/${assetId}`;
   return remove(ref(_realtimeDB, path));
};

export const realtimeDB = {
   readData,
   create: createRealtimeDB,
   read: readRealtimeDB,
   update: updateRealtimeDB,
   delete: deleteRealtimeDB,
};

// Storage
const _storage = getStorage(app);
const uploadFile = async (projectId: string, path: string, fileURI: string) => {
   // Why are we using XMLHttpRequest? See:
   // https://github.com/expo/expo/issues/2402#issuecomment-443726662
   const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
         resolve(xhr.response);
      };
      xhr.onerror = function (e) {
         console.log(e);
         reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', fileURI, true);
      xhr.send(null);
   });

   const storageRef = sref(_storage, path);
   const result = await uploadBytes(storageRef, blob);

   // We're done with the blob, close and release it
   try {
      blob.close();
   } catch (e) {
      console.warn(e);
   }

   return await getDownloadURL(storageRef);
};
const downloadFile = async (path: string) => {
   const storageRef = sref(_storage, path);
   const url = await getDownloadURL(storageRef);
   return url;
};
const listFiles = async (path = '') => {
   const storageRef = sref(_storage, path);
   const listRef = sref(storageRef);
   const res = await listAll(listRef);
   return res.items;
};
const deleteFile = async (path: string) => {
   const storageRef = sref(_storage, path);
   await deleteObject(storageRef);
};
export const storage = {
   uploadFile,
   downloadFile,
   listFiles,
   deleteFile,
};
