/**
 * Created by Linus on 2018-06-08.
 */

const queryString = require("query-string");

class WtdFetcher{
    constructor(apiKey){
        this.apiKey = apiKey;

        this.getStockRealTime = this.getStockRealTime.bind(this);
        this.getStockHistorical = this.getStockHistorical.bind(this);
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
        if(wtdData.symbols_returned !== undefined){
            var chosenStock;
            if(wtdData.symbols_returned === 1){
                chosenStock = wtdData.data[0];
            } else{
                chosenStock = this._chooseStockByPrice(wtdData.data, ['USD', 'EUR']);
            }

            return chosenStock;
        } else{
            if(wtdData.Message !== undefined){
                console.log(Error("Message from WTD: " + wtdData.Message));
            }else{
                console.log(Error("NO SYMBOL OR MESSAGE"));
            }
        }
    }

    _processHistory(wtdData){
        if(wtdData.history !== undefined){
            var totalOpen = 0;
            var totalClose = 0;
            var totalDailyGrowth = 0;
            var totalVolume = 0;

            for(var date in wtdData.history) {
                if (!wtdData.history.hasOwnProperty(date)) continue;
                var dailyData = wtdData.history[date.toString()];

                totalOpen += dailyData.open;
                totalClose += dailyData.close;
                totalDailyGrowth += dailyData.close - dailyData.open;
                totalVolume += dailyData.volume;
            }

            var nrOfP = wtdData.history.length;
            return {
                name: wtdData.name,
                avgOpen: totalOpen / nrOfP,
                avgClose: totalClose / nrOfP,
                avgDailyGrowth: totalDailyGrowth / nrOfP,
                avgVolume: totalVolume / nrOfP
            };
        } else{
            console.log(Error("NO HISTORICAL DATA"));
        }
    }

    async getStockRealTime(symbols){
        var args = {symbol: symbols.join(",")};
        let stockInfo = await this._makeRequest("stock", args);
        return this._decideStock(stockInfo);
    }

    async getStockHistorical(symbol, dateStart, dateEnd){
        const args = {
            symbol: symbol,
            date_from: dateStart.toISOString().slice(0, 10),
            date_to: dateEnd.toISOString().slice(0, 10)
        };
        console.log(args);

        let stockInfo = this._getStockRealTime(symbol);
        console.log(stockInfo);
        let stockHistory = await this._makeRequest("history", args);
        console.log(stockHistory);
        return {stock: stockInfo, history: this._processHistory(stockHistory)};
    }
}


export default WtdFetcher;
