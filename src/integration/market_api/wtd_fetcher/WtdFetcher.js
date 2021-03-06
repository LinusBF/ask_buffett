/**
 * Created by Linus on 2018-06-08.
 */
import { StockNotFoundError, StockHistoryNotAvailableError } from "../../../errors/CustomErrors";

const queryString = require("querystring");

class WtdFetcher{
    constructor(apiKey){
        this.apiKey = apiKey;

        this.getStockRealTime = this.getStockRealTime.bind(this);
        this.getStockHistorical = this.getStockHistorical.bind(this);
    }

    _makeRequest(endPoint, args){
        return new Promise((resolve, reject) =>{
            let request = new XMLHttpRequest();
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
        let i = 0;
        let chosenStock = null;
        while (i < currencyPrio.length && chosenStock === null){
            let data = stocksData.slice();
            let stocksByCur = data.filter((stock) => stock.currency === currencyPrio[i]);
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
            let chosenStock;
            if(wtdData.symbols_returned === 1){
                chosenStock = wtdData.data[0];
            } else{
                chosenStock = this._chooseStockByPrice(wtdData.data, ['USD', 'EUR']);
            }

            return chosenStock;
        } else{
            let errorMessage;
            if(wtdData.Message !== undefined){
                errorMessage ="Message from WTD: " + wtdData.Message;
            }else{
                errorMessage = "NO SYMBOL OR MESSAGE";
            }
            throw Error(errorMessage);
        }
    }

    _processStockHistory(wtdData){
        if(wtdData.history !== undefined){
            let totalOpen = 0;
            let totalClose = 0;
            let totalDailyGrowth = 0;
            let totalVolume = 0;
            let minClose = {date: null, value: Number.MAX_VALUE};
            let maxClose = {date: null, value: 0};

            for(let date in wtdData.history) {
                if (!wtdData.history.hasOwnProperty(date)) continue;
                let dailyData = wtdData.history[date];

                let openValue = parseFloat(dailyData.open);
                let closeValue = parseFloat(dailyData.close);

                minClose = (closeValue < minClose.value ? {date: date, value: closeValue} : minClose);
                maxClose = (closeValue > maxClose.value ? {date: date, value: closeValue} : maxClose);
                totalOpen += openValue;
                totalClose += closeValue;
                totalDailyGrowth += closeValue - openValue;
                totalVolume += parseFloat(dailyData.volume);
            }

            let nrOfP = Object.keys(wtdData.history).length;
            let firstClose = parseFloat(wtdData.history[Object.keys(wtdData.history)[0]].close);
            let lastClose = parseFloat(wtdData.history[Object.keys(wtdData.history)[nrOfP - 1]].close);
            return {
                name: wtdData.name,
                avgOpen: (totalOpen / nrOfP),
                avgClose: (totalClose / nrOfP),
                avgDailyGrowth: (totalDailyGrowth / nrOfP),
                avgVolume: (totalVolume / nrOfP),
                totalGrowth: (firstClose - lastClose),
                minClose: minClose,
                maxClose: maxClose
            }
        } else{
            throw Error("NO HISTORICAL DATA");
        }
    }

    async getStockRealTime(symbols){
        let args = {symbol: symbols};
        let stockInfo = await this._makeRequest("stock", args);
        let chosenStock;
        try{
            chosenStock = this._decideStock(stockInfo);
        } catch (e){
            throw new StockNotFoundError(e);
        }

        return chosenStock;
    }

    async getStockHistorical(symbol, dateStart, dateEnd){
        const args = {
            symbol: symbol,
            date_from: dateStart.toISOString().slice(0, 10),
            date_to: dateEnd.toISOString().slice(0, 10)
        };

        let stockInfo = await this.getStockRealTime(symbol);
        let stockHistory = await this._makeRequest("history", args);
        let processedHistory;
        try{
            processedHistory = this._processStockHistory(stockHistory);
        }catch (e){
            throw new StockHistoryNotAvailableError(e);
        }
        return {stock: stockInfo, history: processedHistory, dates: {from: dateStart, to: dateEnd}};
    }
}


export default WtdFetcher;
