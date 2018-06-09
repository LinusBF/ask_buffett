/**
 * Created by Linus on 2018-06-08.
 */

import WtdMessages from "./WtdMessages";
const queryString = require("query-string");

class WtdFetcher{
    constructor(apiKey){
        this.apiKey = apiKey;
        this.messages = WtdMessages;

        this.decideStock = this.decideStock.bind(this);
    }

    makeRequest(endPoint, args, callback){
        var request = new XMLHttpRequest();
        request.open("GET", "https://www.worldtradingdata.com/api/v1/" + endPoint + "?" + queryString.stringify(args) + "&api_token=" + this.apiKey, true);
        request.onload = function (e) {
            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.response));
            }
        };
        request.send(null);
    }

    getStockPrice(symbols, registerResponse){
        var args = {symbol: symbols.join(",")};
        this.makeRequest("stock", args, this.handleStockPrice.bind(this, registerResponse));
    }

    handleStockPrice(registerResponse, wtdData){
        console.log(wtdData);
        var that = this;
        this.decideStock(wtdData).then(function (chosenStock) {
            registerResponse(that.messages.stockPriceMsg(chosenStock));
        }).catch(function (err) {
            console.log(err);
            registerResponse(that.messages.couldNotFindStock());
        });
    }

    decideStock(wtdData){
        return new Promise((resolve, reject) =>{
            if(wtdData.symbols_returned !== undefined){
                var chosenStock;
                if(wtdData.symbols_returned === 1){
                    chosenStock = wtdData.data[0];
                } else{
                    chosenStock = this.chooseStockByPrice(wtdData.data, ['USD', 'EUR']);
                }

                resolve(chosenStock);
            } else{
                reject(Error("NO SYMBOL"));
            }
        })
    }

    chooseStockByPrice(stocksData, currencyPrio){
        var i = 0;
        var chosenStock = null;
        while (i < currencyPrio.length && chosenStock === null){
            var data = stocksData.slice();
            var stocksByCur = data.filter((stock) => stock.currency === currencyPrio[i]);
            if(stocksByCur.length > 0){
                chosenStock = stocksByCur.reduce((max, stock) => stock.price > max.price ? stock : max, stocksByCur[0]);
            }
        }

        if(chosenStock === null){
            chosenStock = stocksData.reduce((max, stock) => stock.price > max.price ? stock : max, stocksData[0]);
        }

        return chosenStock;
    }
}


export default WtdFetcher;
