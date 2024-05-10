import { useSelector } from 'react-redux';
import { useWindowDimensions } from 'react-native';
import { getStyleForPlatform } from './../utils/styleHelper/stylesHelper';

function useStyle(styleConfig: any, parentStyle: any) {
  
  const colours = useSelector((state: Record<string, any>) => state.designSystem?.colours);
  const fonts = useSelector((state: Record<string, any>) => state.designSystem?.fonts);
  const responsiveFactor = useSelector((state: Record<string, any>) => state.designSystem?.responsiveFactor);
  const windowDimensions = useWindowDimensions();
  console.log('hook', windowDimensions)
  const componentStyle = getStyleForPlatform({
      styles: styleConfig,
      parentStyle,
      colours,
      fonts,
      responsiveFactor,
      windowDimensions,
      debug: {
         source: 'Use style'
      }
   }) || {};
 
  return componentStyle;
}

export default useStyle;