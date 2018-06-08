/**
 * Created by Linus on 2018-06-08.
 */

export default class MarketApi{
    constructor(fetcher = MarketApi.Fetchers.DEFAULT){
        this.currentFetcher = fetcher;
    }

    getResponse(query){
        return query + " answer";
    }
}

MarketApi.Fetchers = {DEFAULT:"", TENSOR:""};
