import * as React from 'react';
import {GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

import {baseStyles} from './ButtonBase.styles';

export type ButtonBasePressHandler = (event: GestureResponderEvent) => void;

export type ButtonBaseStyles = StyleSheet.NamedStyles<{
    container?: ViewStyle;
    text?: TextStyle;
}>;

export interface IButtonBaseProps {
    labelText: string;
    styles?: ButtonBaseStyles;
    onPress?: ButtonBasePressHandler;
}

export const ButtonBase = ({labelText, styles, onPress}: IButtonBaseProps) => {
    return (
        <TouchableOpacity style={[baseStyles.container, styles?.container]} onPress={onPress}>
            <Text style={[baseStyles.text, styles?.text]}>{labelText}</Text>
        </TouchableOpacity>
    );
};
