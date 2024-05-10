import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { useEffect } from 'react';
import { TText } from 'src/types/schema';
import { TCreateComponentFuncAsProp } from 'src/types/general';

export function parseText(text = '', style = {}) : any {
      const parts = text.split(/\[b\]|\[\/b\]|\[color=#[a-f0-9]{6}\]|\[\/color\]/i);
      return parts.map((part: any, index: any) => {
            if (/\[color=#[a-f0-9]{6}\]/i.test(part)) {
                  const color = (part.match(/\[color=(#[a-f0-9]{6})\]/i) || [''])[1];
                  return parseText(part.replace(/\[color=#[a-f0-9]{6}\]/i, ''), { ...style, color });
            } else if (index % 2 === 0) {
                  return <RNText key={index} style={style}>{part}</RNText>;
            } else {
                  return parseText(part, { ...style, fontWeight: 'bold' });
            }
      });
};

type TProps = TText & TCreateComponentFuncAsProp & Pick<TextProps, 'style'>;

const Text = (props: TProps) => {
      
      const {style, text, dataCellRootId, uid, dataCell} = props;

      useEffect(() => {
            props.handleTextChanges(text, uid, dataCellRootId)
      }, [dataCell])

      return (
            <RNText style={style.text}>
                  {
                        parseText(text)
                  }
            </RNText>
      )
};

const styles = StyleSheet.create({
      normal: {
            fontWeight: 'normal',
      },
      bold: {
            fontWeight: 'bold',
      },
});

export default Text;
