import * as React from 'react';

import {createBaseStyles} from './SolidButton.styles';
import {ButtonBase, ButtonBasePressHandler} from '../ButtonBase';
import {useTheme} from '../../../hooks/useTheme';

export interface ISolidButtonProps {
    labelText: string;
    disabled?: boolean;
    loading?: boolean;
    onPress?: ButtonBasePressHandler;
}

export const SolidButton = ({labelText, disabled, loading, onPress}: ISolidButtonProps) => {
    const theme = useTheme();
    const baseStyles = React.useMemo(() => createBaseStyles(theme), [theme]);

    return (
        <ButtonBase styles={baseStyles} labelText={labelText} disabled={disabled} loading={loading} onPress={onPress} />
    );
};
