import {ApolloProvider} from '@apollo/client';
import React from 'react';
import {useColorScheme} from 'react-native';
import {NativeRouter, Routes, Route} from 'react-router-native';

import {client as apolloClient} from '../../graphql/client';
import {LoginRoute} from '../../routes/LoginRoute';
import {HomeRoute} from '../../routes/HomeRoute';

export const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    console.log(isDarkMode);

    return (
        <ApolloProvider client={apolloClient}>
            <NativeRouter>
                <Routes>
                    <Route element={<LoginRoute />} index />
                    <Route path="/home" element={<HomeRoute />} />
                </Routes>
            </NativeRouter>
        </ApolloProvider>
    );
};
