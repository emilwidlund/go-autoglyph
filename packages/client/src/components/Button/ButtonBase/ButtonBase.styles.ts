import {StyleSheet} from 'react-native';

import {IThemeSpec} from '../../../utils/theme';

export const createBaseStyles = ({fontSize}: IThemeSpec) =>
    StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14
        },
        disabledContainer: {
            opacity: 0.2
        },
        text: {
            fontSize: fontSize.medium,
            fontWeight: '500'
        }
    });
