import { View, Text, TextInput as TI, DimensionValue, useWindowDimensions, ColorValue, NativeSyntheticEvent, TextInputKeyPressEventData, TextInputFocusEventData, StyleProp, ViewStyle, InputModeOptions } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'

type Props = {
  width?: DimensionValue | undefined,
  height?: DimensionValue | undefined,
  mt?: DimensionValue | undefined,
  bg?: ColorValue | undefined,
  color?: ColorValue | undefined,
  placeholder?: string,
  sideText?: string | undefined,
  endIcon?: {
    name: string,
    type: string,
    color: string
  },
  startIcon?: {
    name: string,
    type: string,
    color: string
  }
  center?: boolean,
  clearTextOnFocus?: boolean,
  noinput?: boolean,
  secureTextEntry?: boolean,
  ref?: any,
  onKeyPress?:
  | ((e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void)
  | undefined
  onChangeText?: ((text: string) => void) | undefined,
  onFocus?:
  | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
  | undefined,
  containerStyle?: StyleProp<ViewStyle> | undefined,
  value?: string,
  lines?: number,
  inputMode?: InputModeOptions | undefined;
}

const TextInput = (p: Props) => {

  const { height, width } = useWindowDimensions();

  return (
    <View style={[{
      width: (p.width) ? p.width : '100%',
      height: (p.lines && p.lines > 0) ? 150 : ((p.height) ? p.height : height / 15),
      backgroundColor: (p.bg) ? p.bg : '#f1f1f1',
      marginTop: (p.mt) ? p.mt : 0,
      borderRadius: 10,
      alignItems: 'center',
      flexDirection: 'row',
    }, p.containerStyle]}>
      {
        (p.sideText) &&
        <View style={{
          backgroundColor: '#eee', paddingHorizontal: '5%',
          height: '100%', justifyContent: 'center',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}>
          <Text style={{ fontFamily: 'Poppins-Medium', color: '#111' }}>{p.sideText}</Text>
        </View>
      }
      {
        (p.startIcon) && <Icon style={{ marginLeft: 10 }} color={p.startIcon.color} name={p.startIcon.name} type={p.startIcon.type} />
      }
      <TI secureTextEntry={p.secureTextEntry} value={p.value} inputMode={p.inputMode} onFocus={p.onFocus}
        placeholderTextColor={'#aaa'} editable={!p.noinput} ref={p.ref}
        onKeyPress={p.onKeyPress} clearTextOnFocus={p.clearTextOnFocus}
        onChangeText={p.onChangeText} placeholder={p.placeholder} style={{
          flex: 1,
          marginLeft: (p.center) ? 0 : 10,
          marginVertical: (p.lines && p.lines > 0) ? 10 : 0,
          fontFamily: 'Poppins-Medium',
          textAlign: (p.center) ? 'center' : 'left',
          color: (p.color) ? p.color : '#000',
          textAlignVertical: (p.lines && p.lines > 0) ? 'top' : 'center',
        }}
        multiline={(p.lines && p.lines > 0) ? true : false}
        numberOfLines={(p.lines) ? p.lines : 1}
      />
      {
        (p.endIcon) && <Icon style={{ marginRight: '5%' }} color={p.endIcon.color} name={p.endIcon.name} type={p.endIcon.type} />
      }
    </View>
  )
}

export default TextInput