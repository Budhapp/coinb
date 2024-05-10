import { IComponentLogicFlow, TComponentVisualLogic } from "./logic";

export type TSchema = {
   design_system: TDesignSystem;
   page_index: string;
   pages: Record<string, TPage>;
   data_model: Record<string, TDataModel>;
};

export type TDesignSystem = {
   responsive_factor: TResponsiveFactor;
   colours: TColors;
   fonts: TFont[];
   user_styles: Record<string, any>;
};

export type TResponsiveFactor = {
   mobile: number;
   tablet: number;
   desktop: number;
   xl: number;
};

export type TColors = Record<string, string>;

export type TFont = {
   font: string;
   weights: string[];
};

export type TPage = TComponent & {
   ico: string;
   root_component: string;
};

export type TComponentType = 'box' | 'modal' | 'boxList' | 'text' | 'input' | 'image' | 'chart';

export type TComponent = TBox | TText | TInput | TImage;

export type TBox = TComponentBase<'box', TComponentCommonProps>;
export type TText = TComponentBase<'text', TComponentCommonProps & { text?: string }>;
export type TInput = TComponentBase<'input', TComponentCommonProps>;
export type TImage = TComponentBase<'image', TComponentCommonProps & {
   image?: string;
   icon?: {
      type: 'FontAwesome' | 'MaterialIcons' | 'Ionicons';
      src: string;
      color?: string;
      size?: number
   };
}>;

export type TComponentBase<T extends TComponentType, P = {}> = {
   type: T;
   uid: string;
   order: number;
   name?: string;
   properties?: P;
   custom_styling?: TCustomStyling;
   data?: Record<string, TComponentData>;
   logic?: Record<string, IComponentLogicFlow>;
   visual_logic?: TComponentVisualLogic[];
   children?: Record<string, TComponent>;
   component?: any;
   components?: any;
   style?: any;
   parentLayout?: any;
   dataCellSuffix?: any;
   dataCellRootId?: any;
   componentData?: any;
   runWorkflow?: any;
   handleValueChanges?: any;
   input_value?: any;
   dataCell?: any;
   handleTextChanges: any;
   componentProperties: any;
   text: any;
};

export type TComponentCommonProps = {
   is_hidden?: boolean;
   is_disabled?: boolean;
   list_of_items?: object;
};
