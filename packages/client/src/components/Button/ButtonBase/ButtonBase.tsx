import * as React from 'react';
import {
    ActivityIndicator,
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import {useTheme} from '../../../hooks/useTheme';

import {createBaseStyles} from './ButtonBase.styles';

export type ButtonBasePressHandler = (event: GestureResponderEvent) => void;

export type ButtonBaseStyles = StyleSheet.NamedStyles<{
    container?: ViewStyle;
    text?: TextStyle;
}>;

export interface IButtonBaseProps {
    labelText: string;
    disabled?: boolean;
    loading?: boolean;
    styles?: ButtonBaseStyles;
    onPress?: ButtonBasePressHandler;
}

export const ButtonBase = ({labelText, disabled, loading, styles, onPress}: IButtonBaseProps) => {
    const theme = useTheme();
    const baseStyles = React.useMemo(() => createBaseStyles(theme), [theme]);
    const isDisabled = React.useMemo(() => disabled || loading, [disabled, loading]);

    return (
        <TouchableOpacity
            style={StyleSheet.flatten([
                baseStyles.container,
                isDisabled && baseStyles.disabledContainer,
                styles?.container
            ])}
            activeOpacity={0.6}
            onPress={onPress}
            disabled={isDisabled}>
            {loading ? (
                <ActivityIndicator size="small" color={theme.colors.text.light} />
            ) : (
                <Text style={StyleSheet.flatten([baseStyles.text, styles?.text])}>{labelText}</Text>
            )}
        </TouchableOpacity>
    );
};
