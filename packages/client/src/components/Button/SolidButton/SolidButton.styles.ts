import {StyleSheet} from 'react-native';

import {IThemeSpec} from '../../../utils/theme';

export const createBaseStyles = ({colors, dimensions}: IThemeSpec) =>
    StyleSheet.create({
        container: {
            borderRadius: dimensions.borderRadius.xlarge,
            backgroundColor: colors.brand.primary
        },
        text: {
            color: colors.text.light
        }
    });
