/**
 * Created by Linus on 2018-06-08.
 */

const {Wit, log} = require('node-wit');

class WitApi{
    constructor(witSecret){
        this.client = new Wit({
            accessToken: witSecret,
            logger: new log.Logger(log.DEBUG)
        });
    }

    getWitResponse(query, callback){
        this.client.message(query, {})
            .then((data) => {
                callback(data)
            })
            .catch(console.error);
    }
}

export default WitApi
