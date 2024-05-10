type Unit = 'rf' | 'px' | '%' | 'vh'; // rf = responsive factor. Default unit is rf almost everywhere

type TBorderStyle = 'solid' | 'dashed' | 'none';

export type TRichString = string;

type TNumericalValue = {
   val: number; // TRichString that must be valuated to a numerical value
   unit: Unit;
};

type TBorderSectionType = {
   width: TNumericalValue;
   color: TRichString;
   style: TBorderStyle;
};

type TSpacing = {
   top?: TNumericalValue;
   right?: TNumericalValue;
   bottom?: TNumericalValue;
   left?: TNumericalValue;
};

type TTextStyling = {
   color?: TRichString;
   alignment?: 'left' | 'center' | 'right' | 'justify';
   size?: TNumericalValue;
   font?: string;
   line_height?: TNumericalValue;
   weight?: TNumericalValue;
   shadow?: {
      color?: TRichString;
      horizontal?: number; // could be TNumericalValue
      vertical?: number;
      blur?: number;
   };
};

export type TCustomStyling = {
   width?: {
      type?: 'fit' | 'expand' | 'fixed'; // expand by default
      min?: TNumericalValue;
      max?: TNumericalValue;
      fixed?: TNumericalValue;
   };
   height?: {
      type?: 'fit' | 'expand' | 'fixed' | 'ratio'; // fit by default
      min?: TNumericalValue;
      max?: TNumericalValue;
      fixed?: TNumericalValue;
      ratio?: { width: number; height: number };
   };
   margin?: TSpacing;
   padding?: TSpacing;
   border?: {
      top?: TBorderSectionType;
      right?: TBorderSectionType;
      bottom?: TBorderSectionType;
      left?: TBorderSectionType;
   };
   radius?: {
      top_left?: TNumericalValue;
      top_right?: TNumericalValue;
      bottom_left?: TNumericalValue;
      bottom_right?: TNumericalValue;
   };
   clip?: boolean; // hide overflow, default = false
   layout?: {
      direction?: 'row' | 'column'; // column by default
      column_gap?: TNumericalValue;
      row_gap?: TNumericalValue;
      distribution?: 'between' | 'start' | 'center' | 'end' | 'evenly'; // between by default
   };
   position?: {
      type?: 'auto' | 'relative' | 'absolute' | 'fixed'; // auto by default
      auto?: {
         order: number
         cross_axis?: 'start' | 'center' | 'end'; // center by default
      };
      relative?: {
         horizontal?: 'start' | 'center' | 'end'; // center by default
         vertical?: 'start' | 'center' | 'end'; // center by default
      }
      absolute?: {
         top?: TNumericalValue; // default unit is %
         right?: TNumericalValue; // default unit is %
         bottom?: TNumericalValue; // default unit is %
         left?: TNumericalValue; // default unit is %
      };
   };
   background?: {
      type?: 'color' | 'image' | 'gradient' | 'none'; // none by deault
      image?: {
         src: TRichString;
         //  position?: ;
         cover?: boolean; // default = true
         repeat?: boolean; // default = false
      };
      color?: TRichString; // hex, rgb, rgba, string (blue etc) "{{[{getProperty('color')}]}}"
      gradient?: {
         type?: 'linear' | 'radial';
         colors?: TRichString[];
         linear?: {
            direction?: 'to bottom' | 'to left' | 'to right' | 'to top';
         };
         radial?: {
            shape?: 'ellipse' | 'circle';
            base?: 'farthest-corner' | 'closest-corner' | 'farthest-side' | 'closest-side';
            center_x?: number;
            center_y?: number;
         };
      };
   };
   text?: TTextStyling;
   placeholder?: TTextStyling;
};
