/**
 * Created by Linus on 2018-06-08.
 */

class WtdFetcher{
    constructor(apiKey){
        this.apiKey = apiKey;
    }

    makeRequest(symbol, callback){
        var request = new XMLHttpRequest();
        request.open("GET", "https://www.worldtradingdata.com/api/v1/stock?symbol=" + symbol + "&api_token=" + this.apiKey, true);
        request.onload = function (e) {
            if (request.readyState === 4 && request.status === 200) {
                callback(request.response);
            }
        };
        request.send(null);
    }

    getStockPrice(symbols){
        var stockData = this.makeRequest(symbols.join(","), )
    }
}


export default WtdFetcher;
