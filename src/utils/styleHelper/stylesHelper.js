import { cssProperties } from './../../consts/cssProperties'
import { computeStyle } from './../../utils/styleHelper/styleParser';
import { StyleSheet } from 'react-native';

export function detectTheming(value) {
  return typeof value === 'string' && (value[0] === '@' || value.indexOf('@') >= 0);
}

export function getStyleForPlatform({
   styles, 
   parentStyle, 
   colours,
   fonts, 
   responsiveFactor, 
   windowDimensions, 
   debug
}) {
   const isDebug = debug?.uid === 'f66d7c4d-49c2-4858-9005-ebebf95ccf69_0'
   // 87a7c506-94cb-4756-bf7b-8950076d85ab

   if (isDebug) console.log('DEBUG', debug?.source, parentStyle)

   const componentStyle = computeStyle({
      itemDefinition: styles, 
      parentStyle, 
      responsiveFactor, 
      windowDimensions,
      debug: isDebug
   });

   if (isDebug) {
      console.log(styles)
      console.log('COmputed:', componentStyle)
   }
  // Unclean: this uses side effect. Preferably, we should use a pure function
  recursiveTheming(componentStyle, colours, fonts);
  // Object.keys(componentStyle).forEach(key => {
  //   if (detectTheming(componentStyle[key])) {
  //     componentStyle[key] = colours[componentStyle[key].slice(1)];
  //   }
  // });

  return componentStyle;
}

function recursiveTheming(styles, colours, fonts) {
  Object.keys(styles).forEach(key => {
    if (detectTheming(styles[key])) {
      try {
        const stringColor = styles[key];
        const match = stringColor.startsWith('@');
        if (match) {
          const propertyName = styles[key].slice(styles[key].indexOf('@') + 1);
          let replacementValue = colours ? colours[propertyName]?.color : '';
          if (propertyName.endsWith('_rgb')) {
            replacementValue = colours[propertyName.slice(0, propertyName.length - 4)].replace('rgba', 'rgb').replace(/,[^,]+$/, ')');
          }
          const newString = stringColor.replace(stringColor, replacementValue);
          if (newString) {
            styles[key] = newString;
          }
        }
      } catch (ex) {
        console.error(ex);
      }
    }
    else if (typeof styles[key] === 'object') {
      recursiveTheming(styles[key], colours);
    }
  });
}

export function calcWH(style, parentLayout = {}) {
  const { width: styleWidth, height: styleHeight } = style || {};
  const { width: parentWidth, height: parentHeight } = parentLayout;

  const res = {};

  if(styleWidth)
    res.width = styleWidth && typeof styleWidth == 'String' 
      ? (styleWidth.includes('%')
        ? (parentWidth / 100) * parseInt(styleWidth)
        : styleWidth)
      : parentWidth;

  if(styleHeight)
    res.height = styleHeight && typeof styleHeight == 'String'
      ? (styleHeight.includes('%')
        ? (parentHeight / 100) * parseInt(styleHeight)
        : styleHeight)
      : parentHeight;

  return res;
};

export function checkWebStyle(componentStyle) {

  return fixWebStyle(componentStyle);
}

export function fixWebStyle(componentStyle) {
  var result = {};
  Object.keys(componentStyle).forEach((item) => {
    // if you want check generated style for web
    // CSS.supports(item, componentStyle[item]);
    let isValid = checkStyle({ item: componentStyle[item] });
    if (isValid)
      result[item] = componentStyle[item];
  });

  return result;
}

export function checkStyle(style) {
  try {
    if (typeof style !== 'object') {
      throw new Error('Style must be an object');
    }

    for (let property in style) {
      let value = style[property];

      if (property == 'backgroundColor' || (typeof value == 'string' &&
        (value.includes('%') ||
          value.includes('rgba') ||
          value.includes('px') ||
          value.includes('#') ||
          value.includes('url')))) {
        continue;
      }

      if (typeof value == 'number') {
        continue;
      }

      if (!cssProperties[property].includes(style[property])) {
        throw new Error(`Invalid style property: ${property}`);
      }

      if (typeof value === 'number' && isNaN(value)) {
        throw new Error(`Invalid style value for property ${property}: ${value}`);
      }
    }
    return true;
  }
  catch (ex) {
    return false;
  }
}