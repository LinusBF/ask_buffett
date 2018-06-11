/**
 * Created by Linus on 2018-06-08.
 */

const {Wit, log} = require('node-wit');

const WitApi = new Wit({
    accessToken: process.env.REACT_APP_WIT_SECRET,
    logger: new log.Logger(log.DEBUG)
});

export const getWitResponse = (query) => {
    return WitApi.message(query, {});
}


