import * as React from 'react';
import {View, TextInput} from 'react-native';

import {SolidButton} from '../../components/Button/SolidButton';

export const LoginContainer = () => {
    return (
        <View>
            <TextInput placeholder="Email" keyboardType="email-address" autoCorrect={false} autoCapitalize="none" />
            <TextInput
                placeholder="Password"
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="password"
            />
            <SolidButton labelText="Login" />
        </View>
    );
};
