import { Image as RNImage, ImageProps, Dimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { calcWH } from './../../utils/styleHelper/stylesHelper';
import { TImage } from 'src/types/schema';
import { useEffect } from 'react';

type TProps = TImage & Pick<ImageProps, 'style'>;

const window = Dimensions.get('window');

const Image = (props: TProps) => {
   const { component, uid, dataCellRootId, style, parentLayout, dataCell, image, icon } = props;
   const defaultImageStyle = { flex: 1, objectFit: 'cover', resizeMode: 'contain' };
   const defaultStyle = { flex: 1, textAlign: 'center' };

   useEffect(() => {
      props.handleImageChanges(image, uid, dataCellRootId)
   }, [dataCell])

   if (icon) {
      switch (icon?.type || 'FontAwesome') {
         case 'FontAwesome':
            return <FontAwesome
               style={[defaultStyle, style.image, { justifyContent: 'center' }]}
               iconStyle={[defaultStyle, style.image]}
               name={icon.src}
               size={style.height}
               color={icon.color} />;
         case 'MaterialIcons':
            return <MaterialIcons
               style={[defaultStyle, style.image]}
               iconStyle={[defaultStyle, style.image]}
               name={icon.src}
               size={style.height}
               color={icon.color} />;
         default:
            return null;
      }
   }

   return (<RNImage
      resizeMode='contain'
      style={[defaultImageStyle, style.image]}
      source={{ uri: image }}
      {...calcWH(style, parentLayout)} />)
};

export default Image;