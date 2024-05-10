import { enableScreens } from "react-native-screens";
import { alignments, distribution, alignItems } from "./consts";
import { Platform, useWindowDimensions } from "react-native";
import { TCustomStyling } from "src/types/schema/styling";

export function computeStyle({
   itemDefinition, 
   parentStyle, 
   responsiveFactor, 
   windowDimensions,
   debug = false
}: {
   itemDefinition: TCustomStyling, 
   parentStyle: TCustomStyling, 
   responsiveFactor: any, 
   windowDimensions?: any
   debug?: boolean
}) {
   const styles = [
      widthStyle,
      heightStyle,
      shadowStyle,
      marginStyle,
      paddingStyle,
      borderStyle,
      radiusStyle,
      layoutStyle,
      positionStyle,
      textStyle,
      backgroundStyle,
      iconStyle
   ].reduce(
      (acc, styleOperation) => styleOperation({
         accStyles: acc, 
         styling: itemDefinition, 
         parentStyle, 
         responsiveFactor,
         debug
      }),
      {}
   );
   return styles;
}

function parseVal(dictValue = { val: '0', unit: 'px' }, responsiveFactor: any, debug: boolean = false) {
   // TODO find a way to get design system instead of componentDef
   // Should create a hook?
   try {
      switch (dictValue.unit || 'px') {
         case '%':
            return `${dictValue.val || 0}%`;
         case 'rf':
            // TODO replace 12 with design system value (see TODO above)
            return Math.round(parseFloat(dictValue.val ?? '0') * (responsiveFactor?.desktop || 12));
         case 'vh':
            return Math.round((parseInt(dictValue.val ?? '0') / 100) * 1000) //(windowDimensions?.height ?? 1000));
         case 'vw':
            return Math.round((parseInt(dictValue.val ?? '0') / 100) * 800) //windowDimensions?.width ?? 800);
         case 'px':
         default:
            return parseInt(dictValue.val) || 0;
      }
   } catch (error) {
      console.warn(
         `Couldn't parse value: ${JSON.stringify(dictValue)}`,
         error.message
      );
   }
}
function widthStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const tmpStyles: {
      width?: number | string,
      flex?: number | string,
      alignSelf?: string,
      minWidth?: number | string,
      maxWidth?: number | string
   } = {}

   switch (styling?.width?.type || 'expand') {
      case 'fixed': {
         tmpStyles['width'] = parseVal(
            styling?.width?.fixed ?? styling?.width?.min,
            responsiveFactor,
            debug
         );
         break;
      }
      case 'fit': {
         tmpStyles['width'] = 'fit-content'
         break;
      }
      case 'expand':
      default:
         if (parentStyle?.flexDirection === 'row') {
            tmpStyles['flex'] = 1;
         } else {
            tmpStyles['alignSelf'] = 'stretch';
         }
         break;
   }

   if (styling?.width?.min?.val) {
      tmpStyles['minWidth'] = parseVal(
         styling?.width.min,
         responsiveFactor
      );
   }
   if (styling?.width?.max?.val) {
      tmpStyles['maxWidth'] = parseVal(
         styling?.width.max,
         responsiveFactor
      );
   }

   if (debug) {
      console.log('[width]', styling?.width?.type, '\nparent direction:', parentStyle, tmpStyles)
   }

   const styles = { ...accStyles, ...tmpStyles };
   return styles;
}

function heightStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.height)
      return styles;

   switch (styling?.height?.type || 'fit') {
      case 'fixed': {
         styles.height = parseVal(
            styling?.height?.fixed || styling?.height?.min,
            responsiveFactor);

         break;
      }
      case 'expand': {
         if (parentStyle?.layout?.direction === 'row') {
            styles.alignSelf = 'stretch';
         } else {
            styles.flex = 1;
         }
         break;
      }
      case 'ratio': {
         styles.aspectRatio =
            (styling?.height?.ratio?.width || 1) +
            ' / ' +
            (styling?.height?.ratio?.height || 1);
         break;
      }
      case 'fit':
      default:
         break;
   }

   if (styling?.height?.min?.val) {
      styles.minHeight = parseVal(styling?.height.min, responsiveFactor);
   }

   if (styling?.height?.max?.val) {
      styles.maxHeight = parseVal(styling?.height.max, responsiveFactor);
   }

   if (debug) {
      console.log('[height]', styling?.height?.type, { height: styles.height, minHeight: styles.minHeight, maxHeight: styles.maxHeight })
   }

   return styles;
}

function shadowStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.shadow)
      return styles;

   if(styling?.shadow?.color)
      styles.shadowColor = styling?.shadow?.color;

   if(styling?.shadow?.width || styling?.shadow?.height)
      styles.shadowOffset = {width: parseVal(styling?.shadow?.width || 0, responsiveFactor), height: parseVal(styling?.shadow?.height || 0, responsiveFactor)};

   if(styling?.shadow?.radius)
      styles.shadowRadius = parseVal(styling?.shadow?.radius || 0, responsiveFactor);

   return styles;
}

function marginStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.margin)
      return styles;

   styles.marginTop = parseVal(styling?.margin?.top || 0, responsiveFactor);
   styles.marginLeft = parseVal(styling?.margin?.left || 0, responsiveFactor);
   styles.marginBottom = parseVal(styling?.margin?.bottom || 0, responsiveFactor);
   styles.marginRight = parseVal(styling?.margin?.right || 0, responsiveFactor);

   return styles;
}
function paddingStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.padding)
      return styles;

   styles.paddingTop = parseVal(styling?.padding?.top || 0, responsiveFactor);
   styles.paddingLeft = parseVal(styling?.padding?.left || 0,  responsiveFactor);
   styles.paddingBottom = parseVal(styling?.padding?.bottom || 0,  responsiveFactor);
   styles.paddingRight = parseVal(styling?.padding?.right || 0,  responsiveFactor);

   return styles;
}

function borderStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.border)
      return styles;

   if (styling?.border?.top) {
      styles.borderTopStyle = styling?.border?.top?.style || 'solid';
      styles.borderTopColor = styling?.border?.top?.color || 'black';
      styles.borderTopWidth = parseVal(styling?.border?.top?.width, responsiveFactor);
   }
   if (styling?.border?.left) {
      styles.borderLeftStyle = styling?.border?.left?.style || 'solid';
      styles.borderLeftColor = styling?.border?.left?.color || 'black';
      styles.borderLeftWidth = parseVal(styling?.border?.left?.width, responsiveFactor);
   }
   if (styling?.border?.bottom) {
      styles.borderBottomStyle = styling?.border?.bottom?.style || 'solid';
      styles.borderBottomColor = styling?.border?.bottom?.color || 'black';
      styles.borderBottomWidth = parseVal(styling?.border?.bottom?.width, responsiveFactor);
   }
   if (styling?.border?.right) {
      styles.borderRightStyle = styling?.border?.right?.style || 'solid';
      styles.borderRightColor = styling?.border?.right?.color || 'black';
      styles.borderRightWidth = parseVal(styling?.border?.right?.width, responsiveFactor);
   }

   return styles;
}

function radiusStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.radius)
      return styles;

   styles.borderTopLeftRadius = parseVal(styling?.radius?.top_left || {}, responsiveFactor);
   styles.borderTopRightRadius = parseVal(styling?.radius?.top_right || {}, responsiveFactor);
   styles.borderBottomLeftRadius = parseVal(styling?.radius?.bottom_left || {}, responsiveFactor);
   styles.borderBottomRightRadius = parseVal(
      styling?.radius?.bottom_right || {},
      responsiveFactor
   );
   if (
      styles.borderTopLeftRadius ||
      styles.borderTopRightRadius ||
      styles.borderBottomLeftRadius ||
      styles.borderBottomRightRadius
   ) {
      styles.overflow = 'hidden';
   }

   return styles;
}
function layoutStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.layout)
      return styles;

   styles.layout = styles.layout || {};
   if (styling?.layout?.direction) {
      if (styling?.layout?.direction === 'rowWrap') {
         styles.layout.flexDirection = 'row';
         styles.layout.flexWrap = 'wrap';

      }
      else if (styling?.layout?.direction === 'columnWrap') {
         styles.layout.flexDirection = 'column';
         styles.layout.flexWrap = 'wrap';
      }
      else
         styles.layout.flexDirection = styling?.layout?.direction;
   }
   
   if (styling?.layout?.distribution) {
      styles.layout.justifyContent = distribution[styling?.layout?.distribution];
   }
   if (styling?.layout?.alignment) {
      styles.layout.alignItems = alignItems[styling?.layout?.alignment];
   }

   if (styling?.layout?.column_gap) {
      styles.layout.columnGap = parseVal(styling?.layout?.column_gap, responsiveFactor);
   }
   if (styling?.layout?.row_gap) {
      styles.layout.rowGap = parseVal(styling?.layout?.row_gap, responsiveFactor);
   }

   return styles;
}

function positionStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.position)
      return styles;

   switch (styling?.position?.type || 'auto') {
      case 'auto':
         if (styling?.position?.auto?.order) {
            styles.order = styling?.position?.auto?.order;
         }
         if (styling?.position?.auto?.position) {
            styles.alignSelf = alignments[styling?.position?.auto?.position] || 'stretch';
         }
         break;
      case 'fixed':
         styles.position = 'absolute';
         styles.zIndex = 1;
         if(styling?.position?.relative?.top)
            styles.top = parseVal(styling?.position?.relative?.top, responsiveFactor);
         if(styling?.position?.relative?.right)
            styles.right = parseVal(styling?.position?.relative?.right, responsiveFactor);
         if(styling?.position?.relative?.bottom)
            styles.bottom = parseVal(styling?.position?.relative?.bottom, responsiveFactor);
         if(styling?.position?.relative?.left)
            styles.left = parseVal(styling?.position?.relative?.left, responsiveFactor);
         break;
      case 'relative':
         styles.alignSelf = alignments[styling?.position?.relative?.vertical] || 'start';
         break;
      case 'absolute':
         styles.top = parseVal(styling?.position?.absolute?.top, responsiveFactor);
         styles.right = parseVal(styling?.position?.absolute?.right, responsiveFactor);
         styles.bottom = parseVal(styling?.position?.absolute?.bottom, responsiveFactor);
         styles.left = parseVal(styling?.position?.absolute?.left, responsiveFactor);
         break;
      default:
         break;
   }

   if (styling?.position?.flexible) {
      styles.flex = styling?.position?.flexible;
   }

   return styles;
}

function backgroundStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.background)
      return styles;

   styles.layout = styles.layout || {};
   switch (styling?.background?.type || 'none') {
      case 'none': {
         break;
      }
      case 'color': {
         styles.backgroundColor = styling?.background.color;
         break;
      }
      case 'image': {
         styles.image = {};
         styles.image.style = {};

         styles.image.style.alignItems = 'center';
         styles.image.style.justifyContent = 'center';
         styles.image.uri = styling?.background?.image?.src;
         break;
      }
      case 'gradient': {
         // const colors = styling?.background?.gradient?.colors || ['ffffff'];
         styles.gradient = {};
         styles.gradient.colors = styling?.background?.gradient?.colors;
         // const strColors = colors.join(', ');
         switch (styling?.background.gradient?.type) {
            case 'linear': {
               switch (styling?.background.gradient.direction) {
                  case 'to bottom':
                     styles.gradient.start = { x: 0, y: 0 }
                     styles.gradient.end = { x: 1, y: 1 }
                     break;
                  case 'to left':
                     styles.gradient.start = {x: 1, y: 0.25}
                     styles.gradient.end = {x: 0, y: 0.75}
                     break;
                  case 'to right':
                     styles.gradient.start = {x: 0, y: 0.75}
                     styles.gradient.end = {x: 1, y: 0.25}
                     break;
                  case 'to top':
                     styles.gradient.start = { x: 1, y: 1 }
                     styles.gradient.end = { x: 0, y: 0 }
                     break;
               }
               break;
            }
            case 'radial': {
               //TODO Add this for RN
               // const shape = styling?.background.gradient.shape || 'circle';
               // const gradient = `gradient(${strColors})`;
               // styles.background = colors[0];
               // styles.background = `-moz-radial-${gradient}`;
               // styles.background = `-webkit-radial-${gradient}`;
               // styles.background = `radial-${gradient}`;
               // break;
            }
            default:
               console.log('Unknown gradient type:', styling?.background?.type);
               break;
         }
         break;
      }
      default:
         break;
   }
   return styles;
}

function textStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   const styles = { ...accStyles };

   if (!styling?.text)
      return styles;

   styles.text = {};

   if (styling?.text?.color) {
      styles.text.color = styling?.text.color;
   }
   if (styling?.text?.alignment) {
      styles.text.textAlign = styling?.text.alignment;
   }
   if (styling?.text?.size) {
      styles.text.fontSize = parseVal(
         styling?.text.size,
         responsiveFactor);
      
      if(Platform.OS != 'web')
      {
         let fs = styles.text.fontSize / 3;
         styles.text.fontSize = fs < 12 ? 12 : fs;
      }
   }
   const font = styling?.text?.font;
   if (font) {
      styles.text.fontFamily = font.startsWith('@') ? 'Roboto' : font;
   }

   if(Platform.OS == 'web') {
      if (styling?.text?.line_height) {
         styles.text.lineHeight = parseInt(styles.text.fontSize) * parseFloat(styling?.text.line_height);
      }
      else {
         styles.text.lineHeight = styles.text.fontSize;
      }
   }

   if (styling?.text?.weight) {
      styles.text.fontWeight = parseInt(styling?.text.weight);
   }
   if (styling?.text?.shadow) {
      const color = styling?.text.shadow.color || 'rgb(0,0,0,0)';
      const horizontal = parseVal(
         styling?.text.shadow.horizontal,
         responsiveFactor);
      const vertical = parseVal(
         styling?.text.shadow.vertical,
         styling);
      const blur = parseVal(
         styling?.text.shadow.blur,
         responsiveFactor);
      styles.text.textShadow = `${color} ${horizontal}px ${vertical}px ${blur}px`;
   }

   // only for input
   if (styling?.placeholder?.color) {
      // TODO: fix placeholder text color
      // console.log('placeholder color', styling?.placeholder?.color)
      styles.placeholderColor = styling?.placeholder.color;
   }

   return styles;
}

function iconStyle(
   { accStyles, styling, parentStyle, responsiveFactor, debug = false }:
   { accStyles: any, styling: any, parentStyle: TCustomStyling, responsiveFactor: any, debug: boolean }
) {
   if (styling?.icon?.color) {
      if (!accStyles.image) {
         accStyles.image = {};
      }
      accStyles.image.color = styling?.icon.color;
   }

   return accStyles;
}