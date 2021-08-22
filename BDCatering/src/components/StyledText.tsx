import * as React from 'react'
import { NativeModules, Platform } from 'react-native'

import { Text, TextProps } from './Themed'

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
}
const { StatusBarManager } = NativeModules
const statusBar = Platform.OS === "ios" ? 30 : StatusBarManager.HEIGHT;

export default  {
  container: {
    flex: 1,
    marginTop: statusBar,
    paddingHorizontal: 16,
    backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#209539",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 57,
  },
  dflex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
    
  },
  dJC: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'

  },
  dJS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    height: 36,
    margin: 8,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#D4D4D4",
    marginBottom: 20,
  },
  buttonSubmit: {
    alignSelf: 'auto',
    marginTop: 50,
    marginBottom: 20,
  },
}