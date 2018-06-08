/**
 * Created by Linus on 2018-06-08.
 */

const {Wit, log} = require('node-wit');

class WitApi{
    constructor(witSecret){
        this.apiKey = witSecret;
        this.client = new Wit({
            accessToken: witSecret,
            logger: new log.Logger(log.DEBUG)
        });
    }

    getResponse(query){
        return query + " answer";
    }
}

export default WitApi
