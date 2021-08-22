import { TextStyle, ViewStyle, StyleSheet } from "react-native";
import { defaultColor } from "../../constants";


export type CustomProps = {
    errors?: string
    errorStyle?: TextStyle
    containerStyle?: ViewStyle
    title?: string
    titleStyle?: TextStyle,
    touched?: boolean
    secureTextEntry?: boolean
}
export const defaultInputStyle: ViewStyle = {
    backgroundColor: '#fff',
    height: 36,
    marginHorizontal: 8,
    marginVertical: 0,
    flex: 1,
  }
  export const defaultTextStyle: TextStyle = {
    fontSize: 16,
    color: defaultColor.text,
  }
  
export const defaultStyles = StyleSheet.create({
    container: {
      marginVertical: 5,
    },
    row: {
      flexDirection: 'row'
    },
    inputCode: {
      borderWidth: 1,
      height: 40,
      borderColor: '#ccc',
      textAlign: 'center',
      fontSize: 16,
      width: 46,
      borderRadius: 10,
      paddingHorizontal: 4 
    },
    input: {
      ...defaultInputStyle,
      ...defaultTextStyle,
    },
    title: {
      fontSize: 16,
      color: defaultColor.title,
    },
    error: {
      fontSize: 12,
      color: 'red',
    },
  })
  
  export const otherStyles = {
    placeholderTextColor: '#bfbfbf',
    borderInputErrorColor: 'red',
    borderInputFocusColor: '#94bfff',
  }
  