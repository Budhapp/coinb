import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
import { storage } from '../../../utils/service/clientFirebase';

import { updateComponentData } from '../../../reducers/LocalDataSlice';

export default function ImagePicker({ uid, imageURI, onImageChange }: any) {
   const dispatch = useDispatch()

   const projectId = useSelector((state: any) => state.project?.definition?.metadata?.uid)

   const [image, setImage] = useState(imageURI);

   useEffect(() => {
      setImage(imageURI || '')
   }, [imageURI])

   const storeLocally = (imageURI: string) => {
      dispatch(updateComponentData({ uid, key: 'input_value', value: imageURI }));
   }

   const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ExpoImagePicker.launchImageLibraryAsync({
         mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
         if (result.uri) {
            let fileExtension = '';
            switch (result.uri.substring(11, 15)) {
               case 'png;':
                  fileExtension = '.png';
                  break;
               case 'jpeg':
               case 'jpg;':
                  fileExtension = '.jpg';
                  break;
               default:
                  break;
            }
            const uri = await storage.uploadFile(
               projectId,
               'public/' + projectId + '/' + uuid.v4() + fileExtension,
               result?.assets[0].uri
            );

            setImage(uri)
         } else if (result.assets) {
            let fileExtension = '';
            switch (result.assets[0].uri.substring(11, 15)) {
               case 'png;':
                  fileExtension = '.png';
                  break;
               case 'jpeg':
               case 'jpg;':
                  fileExtension = '.jpg';
                  break;
               default:
                  break;
            }
            const uri = await storage.uploadFile(
               projectId,
               'public/' + projectId + '/' + uuid.v4() + fileExtension,
               result?.assets[0].uri
            );
            setImage(uri)
         } else {
            console.warn('Could not get image uri')
         }
      }
   };

   useEffect(() => {
      if (image !== imageURI) {
         if (typeof onImageChange === 'function') {
            onImageChange(image)
         } else {
            storeLocally(image)
         }
      }
   }, [image])

   // TODO: allow scrolling through already uploaded images
   return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <Button style={[styles.button, styles.buttonOk]} title="Pick an image" onPress={pickImage} />
         {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      </View>
   );
}


const styles = StyleSheet.create({
   button: {
      borderRadius: 8,
      padding: 10,
      height: 30,
      minWidth: 105,
      paddingVertical: 6,
      paddingHorizontal: 30,
      gap: 10,
   },
   buttonOk: {
      backgroundColor: '#2E3137',
   },
})