import * as React from 'react';
import {SafeAreaView} from 'react-native';

import {baseStyles} from './Scene.styles';

export const Scene = ({children}: React.PropsWithChildren<{}>) => {
    return <SafeAreaView style={baseStyles.container}>{children}</SafeAreaView>;
};
