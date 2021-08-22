import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { TextInputProps, View, TextInput, Text } from 'react-native'
import { CustomProps, defaultStyles, otherStyles } from './default'


export default function (props: TextInputProps & CustomProps) {
    const hasErrors = props.errors && props.touched

    return(
        <View>
             {/* {props.title && <Text style={[defaultStyles.title, props.titleStyle]}>{props.title}</Text>} */}
            <TextInput 
            {...props}
            style = {[
                defaultStyles.inputCode,
                hasErrors? {borderColor: otherStyles.borderInputErrorColor}: null,
            ]}
            />
             
            {/* {hasErrors && <Text style ={[defaultStyles.error, props.errorStyle]}>{props.errors}</Text>} */}
            
        </View>

    )
}