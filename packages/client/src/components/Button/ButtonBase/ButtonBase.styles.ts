import {StyleSheet} from 'react-native';

export const baseStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14
    },
    text: {
        fontSize: 18,
        fontWeight: '500'
    }
});
