import { useEffect, useState } from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { useDispatch } from 'react-redux';
import { TCreateComponentFuncAsProp } from 'src/types/general';
import { TInput } from 'src/types/schema';

import TextInput from './TextInput'
import ImagePicker from './ImagePicker';
import DocumentPicker from './DocumentPicker';

type TProps = TInput & TCreateComponentFuncAsProp & Pick<TextInputProps, 'style'>;

const Input = (props: TProps) => {
   const dispatch = useDispatch();

   const {
      component,
      style,
      parentLayout,
      input_value,
      uid,
      dataCell,
      dataCellSuffix,
      dataCellRootId,
      componentData,
      componentProperties,
      type,
      text,
      handleTextChanges,
      order,
      createComponentFunc
   } = props;

   const [inputType, setInputType] = useState(componentProperties?.input?.type || 'text')

   useEffect(() => {
      setInputType(componentProperties?.input?.type || '');
   }, [componentProperties?.input?.type]);

   if (inputType === 'document') {
      return <DocumentPicker
         fileType={'csv'}
         // onFileChange={(_: any) => console.error('Error: expecting "onFileChange" function')}
         fileURI={componentData?.input_value}
         uid={uid}
      />
   }
   if (inputType === 'image') {
      return <ImagePicker
         uid={uid}
         imageURI={componentData?.input_value}
      />
   }
   return <TextInput
      component={component}
      style={style}
      parentLayout={parentLayout}
      input_value={input_value}
      uid={uid}
      dataCell={dataCell}
      dataCellSuffix={dataCellSuffix}
      dataCellRootId={dataCellRootId}
      componentData={componentData}
      componentProperties={componentProperties}
      type={type}
      order={order}
      text={text}
      handleTextChanges={handleTextChanges}
      createComponentFunc={createComponentFunc}
   />


   // const [inputText, setInputText] = useState('');
   // const [isValid, setIsValid] = useState(true);

   // useEffect(() => {
   //    if (input_value) {
   //       const regex = /(@@[\w\W]*@@)/;
   //       if (regex.test(input_value))
   //          props.handleValueChanges(componentData?.input_value, uid, dataCellRootId);

   //       setInputText(input_value);
   //    }
   // }, [dataCell, input_value]);

   // const validateText = (text: string) => {
   //    setInputText(text);

   //    const isValid = validateField(type, text);

   //    if (isValid) setIsValid(true);
   //    else setIsValid(false);

   //    dispatch(updateComponentData({ uid, key: 'input_value', value: text }));
   //    dispatch(updateComponentData({ uid, key: 'isValid', value: isValid }));
   // };

   // return (
   //    <RNTextInput
   //       value={inputText}
   //       onChangeText={(text) => validateText(text)}
   //       placeholderTextColor='grey'
   //       style={[
   //          { flex: 1, outlineStyle: 'none' },
   //          // { ...calcWH(style, parentLayout) },
   //          !isValid ? { borderColor: 'red', borderWidth: 2 } : {},
   //          style.text,
   //       ]}
   //       placeholder={placeholder}
   //    />
   // );
};

export default Input;
