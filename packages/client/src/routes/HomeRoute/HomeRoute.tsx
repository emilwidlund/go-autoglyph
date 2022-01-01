import * as React from 'react';
import {useQuery} from '@apollo/client';

import {Scene} from '../../components/Scene';
import {IMeQueryResults} from '../../graphql/queries';
import {ME_QUERY} from '../../graphql/queries/auth';

export const HomeRoute = () => {
    const {data: meData} = useQuery<IMeQueryResults>(ME_QUERY);

    return <Scene>{meData?.me.username}</Scene>;
};
