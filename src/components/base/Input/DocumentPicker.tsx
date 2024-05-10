import * as _DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useDispatch, useSelector} from 'react-redux';
import uuid from 'react-native-uuid';

import { updateComponentData } from '../../../reducers/LocalDataSlice';
import { storage } from '../../../utils/service/clientFirebase';

const DocumentPicker = ({
   fileType = 'any',
   onFileChange,
   fileURI,
   uid,
}: any) => {
   const dispatch = useDispatch()
   const [error, setError] = useState('');
   const projectId = useSelector((state: any) => state.project.projectId)
   const [selectedFile, setSelectedFile] = useState('');

   useEffect(() => {
      setSelectedFile(fileURI || '')
   }, [fileURI])

   const storeLocally = (documentURI: string) => {
      dispatch(updateComponentData({ uid, key: 'input_value', value: documentURI }));
   }

   const handleSelectFile = async () => {
      const checkApplicationFileType = async (file: any) => {
         let fileExtension = file.assets[0].name.split('.').pop();

         if (fileExtension !== fileType) {
            setError(`Invalid file type (${fileExtension}). Expected ${fileType}.`);
         } else {
            const uri = await storage.uploadFile(
               projectId,
               'public/' + projectId + '/' + uuid.v4() + fileExtension,
               file?.assets[0].uri
            );
            setSelectedFile(uri);
            setError('');
         }
      };
      try {
         const result = await _DocumentPicker.getDocumentAsync();
         if (result.canceled === false) {
            switch (fileType) {
               case 'image': {
                  if (result?.mimeType?.slice(0, 6) !== 'image/') {
                     setError(`Invalid file type (${result.mimeType}). Expected ${fileType}.`);
                  } else {
                     setSelectedFile(result);
                     setError('');
                  }
                  break;
               }
               case 'json':
               case 'csv':
               case 'pdf': {
                  checkApplicationFileType(result);
                  break;
               }
               case 'any': {
                  setSelectedFile(result);
                  setError('');
                  break;
               }
               default: {
                  setError(`Invalid file type. Expected ${fileType}.`);
                  break;
               }
            }
         }
      } catch (error: any) {
         console.log('Error selecting file:', error);
         setError(`Error parsing file: ${error?.message}`);
      }
   };

   useEffect(() => {
      if (selectedFile) {
         if (typeof onFileChange === 'function') {
            onFileChange(selectedFile);
         } else {
            storeLocally(selectedFile)
         }
      }
   }, [selectedFile]);

   return (
      <View style={styles.container}>
         <Pressable style={styles.button} onPress={handleSelectFile}>
            <Text numberOfLines={1} style={styles.buttonText}>Select file</Text>
         </Pressable>
         {
            selectedFile ?
               <Text numberOfLines={1} style={styles.selectedFileText}>
                  {selectedFile || ''}
               </Text>
            : null
         }
         {error ? <Text numberOfLines={1} style={styles.error}>{error}</Text> : null}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
   },
   button: {
      backgroundColor: '#ccc',
      borderRadius: 4,
      padding: 10,
   },
   buttonText: {
      color: '#fff',
      fontWeight: 'bold',
   },
   selectedFileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eee',
      borderRadius: 4,
      padding: 10,
   },
   selectedFileText: {
      flex: 1,
      color: '#000000',
      overflow: 'hidden',
      width: 200,
   },
   uploadButton: {
      backgroundColor: '#ccc',
      borderRadius: 4,
      padding: 10,
      marginLeft: 10,
   },
   uploadButtonText: {
      color: '#fff',
      fontWeight: 'bold',
   },
   error: {
      color: 'red',
   },
});

export default DocumentPicker;
