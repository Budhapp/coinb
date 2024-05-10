type TDataType =
    | 'text' | 'number' | 'boolean' | 'date'
    | 'image' | 'video' | 'audio' | 'file'
    | 'list' | 'object'; // TODO: add | 'map';
type TDataSubtype = 'DBreference' | 'componentReference' | 'enum';

type TDataModel = TDataModelObject | TDataModelList | TDataModelCommon; // TDataModelMap

type TDataModelObject = TDataModelCommonProps & {
    type: 'object';
    named_properties: Record<string, TDataModel>;
};

type TDataModelList = TDataModelCommonProps & {
    type: 'list';
    item_type: TDataModel;
};

// type TDataModelMap = TDataModelCommonProps & {
//     type: 'map';
//     item_type: TDataModel;
// };

type TDataModelCommon = TDataModelCommonProps & {
    type: Exclude<TDataType, 'list' | 'map' | 'object'>;
}

type TDataModelCommonProps = {
    uid: string;
    name: string;
    type: TDataType;
    subtype?: TDataSubtype;
}

type TComponentData = {
    uid: string;
    name: string;
    type: TDataType;
    default_value: string | number | boolean | Date | File | Record<string, any>;
};
