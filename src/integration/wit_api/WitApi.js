/**
 * Created by Linus on 2018-06-08.
 */

import Secrets from "../../utils/secrets";
const {Wit, log} = require('node-wit');

const WitApi = new Wit({
    accessToken: Secrets.Wit,
    logger: new log.Logger(log.DEBUG)
});

export function getWitResponse(query){
    return WitApi.message(query, {});
}


