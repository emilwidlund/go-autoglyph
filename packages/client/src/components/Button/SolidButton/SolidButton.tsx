import * as React from 'react';

import {baseStyles} from './SolidButton.styles';
import {ButtonBase, ButtonBasePressHandler} from '../ButtonBase';

export interface ISolidButtonProps {
    labelText: string;
    onPress?: ButtonBasePressHandler;
}

export const SolidButton = ({labelText, onPress}: ISolidButtonProps) => {
    return <ButtonBase styles={baseStyles} labelText={labelText} onPress={onPress} />;
};
