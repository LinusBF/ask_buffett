/**
 * Created by Linus on 2018-06-08.
 */

import WtdMessages from "./WtdMessages";
const queryString = require("query-string");

class WtdFetcher{
    constructor(apiKey){
        this.apiKey = apiKey;
    }

    _makeRequest(endPoint, args){
        return new Promise((resolve, reject) =>{
            var request = new XMLHttpRequest();
            request.open("GET", "https://www.worldtradingdata.com/api/v1/" + endPoint + "?" + queryString.stringify(args) + "&api_token=" + this.apiKey, true);
            request.send(null);
            request.onload = function (e) {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(JSON.parse(request.response));
                } else{
                    reject(Error(e));
                }
            }
        })
    }

    _chooseStockByPrice(stocksData, currencyPrio){
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

    _decideStock(wtdData){
        return new Promise((resolve, reject) =>{
            if(wtdData.symbols_returned !== undefined){
                var chosenStock;
                if(wtdData.symbols_returned === 1){
                    chosenStock = wtdData.data[0];
                } else{
                    chosenStock = this._chooseStockByPrice(wtdData.data, ['USD', 'EUR']);
                }

                resolve(chosenStock);
            } else{
                if(wtdData.Message !== undefined){
                    reject(Error("Message from WTD: " + wtdData.Message));
                }else{
                    reject(Error("NO SYMBOL OR MESSAGE"));
                }
            }
        })
    }

    _handleStock(wtdData, registerResponse, messageFunc, ...messageArgs){
        console.log(wtdData);
        this._decideStock(wtdData).then(function (chosenStock) {
            registerResponse(messageFunc(chosenStock, messageArgs));
        }).catch(function (err) {
            console.log(err);
            registerResponse(WtdMessages.couldNotFindStock());
        });
    }

    getStockPrice(symbols, registerResponse){
        var args = {symbol: symbols.join(",")};
        var that = this;
        this._makeRequest("stock", args).then(function (response) {
            that._handleStock(response, registerResponse, WtdMessages.stockPriceMsg);
        }).catch(function (err) {
            console.log(err);
            registerResponse(WtdMessages.couldNotConnectToAPI());
        });
    }

    getStockCurrency(symbols, registerResponse){
        var args = {symbol: symbols.join(",")};
        var that = this;
        this._makeRequest("stock", args).then(function (response) {
            that._handleStock(response, registerResponse, WtdMessages.stockCurrencyMsg);
        }).catch(function (err) {
            console.log(err);
            registerResponse(WtdMessages.couldNotConnectToAPI());
        });
    }
}


export default WtdFetcher;
