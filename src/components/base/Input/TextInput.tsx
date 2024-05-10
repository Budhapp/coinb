import { useEffect, useState } from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { useDispatch } from 'react-redux';
import { TCreateComponentFuncAsProp } from 'src/types/general';
import { TInput } from 'src/types/schema';

import { updateComponentData } from './../../../reducers/LocalDataSlice';
import { validateField } from './../../../utils/common/textValidator';

type TProps = TInput & TCreateComponentFuncAsProp & Pick<TextInputProps, 'style'>;

const TextInput = (props: TProps) => {
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
   } = props;

   const {
      properties: { input: { placeholder = '', type = 'text' } = {} },
   } = component;

   const [inputText, setInputText] = useState('');
   const [isValid, setIsValid] = useState(true);

   useEffect(() => {
      if (input_value) {
         const regex = /(@@[\w\W]*@@)/;
         if (regex.test(input_value))
            props.handleValueChanges(componentData?.input_value, uid, dataCellRootId);

         setInputText(input_value);
      }
   }, [dataCell, input_value]);

   const validateText = (text: string) => {
      setInputText(text);

      const isValid = validateField(type, text);

      if (isValid) setIsValid(true);
      else setIsValid(false);

      dispatch(updateComponentData({ uid, key: 'input_value', value: text }));
      dispatch(updateComponentData({ uid, key: 'isValid', value: isValid }));
   };

   return (
      <RNTextInput
         value={inputText}
         onChangeText={(text) => validateText(text)}
         placeholderTextColor='grey'
         style={[
            { flex: 1, outlineStyle: 'none' },
            // { ...calcWH(style, parentLayout) },
            !isValid ? { borderColor: 'red', borderWidth: 2 } : {},
            style.text,
         ]}
         placeholder={placeholder}
      />
   );
};

export default TextInput;
