import {useColorScheme} from 'react-native';

import {darkTheme, lightTheme} from '../../utils/theme';

export const useTheme = () => {
    const colorScheme = useColorScheme();

    return colorScheme === 'dark' ? darkTheme : lightTheme;
};
