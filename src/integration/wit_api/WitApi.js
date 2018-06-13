/**
 * Created by Linus on 2018-06-08.
 */

import { Wit } from 'node-wit';

const WitApi = new Wit({
    accessToken: process.env.REACT_APP_WIT_SECRET
});

export const getWitResponse = (query) => {
    return WitApi.message(query, {});
};
