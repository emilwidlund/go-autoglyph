import {useMutation, useQuery} from '@apollo/client';
import * as React from 'react';
import {View, TextInput} from 'react-native';
import {useNavigate} from 'react-router-native';

import {SolidButton} from '../../components/Button/SolidButton';
import {IAuthenticateMutationResults} from '../../graphql/mutations';
import {AUTHENTICATION_MUTATION} from '../../graphql/mutations/auth';
import {IMeQueryResults} from '../../graphql/queries';
import {ME_QUERY} from '../../graphql/queries/auth';
import {ROUTES} from '../../routes';

export const LoginContainer = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {data: meData} = useQuery<IMeQueryResults>(ME_QUERY);
    const [authenticate, {loading}] = useMutation<IAuthenticateMutationResults>(AUTHENTICATION_MUTATION);

    const handleAuthentication = React.useCallback(() => {
        authenticate({variables: {email, password}, refetchQueries: [{query: ME_QUERY}]});
    }, [email, password, authenticate]);

    React.useEffect(() => {
        console.log(meData);
        if (meData?.me) {
            navigate(ROUTES.HOME, {});
        }
    }, [meData, navigate]);

    return (
        <View>
            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="password"
                onChangeText={setPassword}
            />
            <SolidButton labelText="Login" onPress={handleAuthentication} loading={loading} />
        </View>
    );
};
