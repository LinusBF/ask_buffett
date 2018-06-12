/**
 * Created by Linus on 2018-06-08.
 */

import WtdFetcher from "./wtd_fetcher/WtdFetcher";
import StocksMeta from "./StocksMeta";
import { NoIntentError } from "../../errors/CustomErrors";
import { getWitResponse } from "../wit_api/WitApi";

const wtdFetcher = new WtdFetcher(process.env.REACT_APP_WTD_SECRET);


export async function getResponse(query){
    return new Promise((resolve, reject) => {
        getWitResponse(query).then((witResponse) => {
            return _handleWitResponse(witResponse);
        }).then((response) => {
            resolve(response);
        }).catch((e) => {
            reject(e);
        })
    })

}

async function _handleWitResponse(witResponse){

    if(witResponse.entities.intent === undefined){
        throw new NoIntentError(Error("No intent in user message"));
    }
    console.log(witResponse.entities.intent[0].value);
    const intent = witResponse.entities.intent[0].value;

    let queryFunc;
    let fetchFunc;

    switch (intent){
        case "stock_price":
        case "stock_currency":
        case "stock_information":
            queryFunc = _queryRealTimeData;
            fetchFunc = wtdFetcher.getStockRealTime;
            break;
        case "stock_historical_avg":
        case "stock_historical_max":
        case "stock_historical_min":
            queryFunc = _queryHistoricalData;
            fetchFunc = wtdFetcher.getStockHistorical;
            break;
        default:
            break;
    }

    return {response: await queryFunc(witResponse, fetchFunc), intent: intent};
}

async function _queryRealTimeData(witResponse, fetcherFunc){
    let stocks = _getStockSymbols(witResponse.entities.search_query[0].value);
    let symbols = [];
    stocks.forEach((stock) => symbols.push(stock.symbol));

    return await fetcherFunc(symbols);
}

async function _queryHistoricalData(witResponse, fetcherFunc){
    let stocks = _getStockSymbols(witResponse.entities.search_query[0].value);
    let dateStart = null;
    let dateEnd = null;
    let symbols = [];
    stocks.forEach((stock) => symbols.push(stock.symbol));

    if(witResponse.entities.datetime !== undefined){
        if(stocks.length > 1) {
            let filteredStocks = _filterStocksByCurrency(stocks, ['USD', 'EUR']);

            if (filteredStocks.length > 0) {
                symbols = [];
                filteredStocks[0].forEach((stock) => symbols.push(stock.symbol));
            }
        }

        dateStart = new Date(witResponse.entities.datetime[0].from.value.slice(0,10));
        dateEnd = new Date(witResponse.entities.datetime[0].to.value.slice(0,10));
    }

    let symbol = symbols[0]; //Historical fetches can only handle one symbol

    return await fetcherFunc(symbol, dateStart, dateEnd);
}

const _getStockSymbols = stockName => {
    let matchingStocks = StocksMeta.find((stock) => stock.symbol.toLowerCase() === stockName.toLowerCase());

    if(matchingStocks === undefined) {
        matchingStocks = StocksMeta.filter(function (stockMeta) {
            return stockMeta.name.toLowerCase().includes(stockName.toLowerCase());
        });
    } else{
        matchingStocks = [matchingStocks];
    }

    return matchingStocks;
}

const _filterStocksByCurrency = (stocks, currencyOrder) => {
    let i = 0;
    const pushStocks = (stock) => stock.cur === currencyOrder[i];
    let filteredStocks = [];
    while(i < currencyOrder.length){
        let data = stocks.slice();
        filteredStocks.push(data.filter(pushStocks));
        i++;
    }

    return filteredStocks;
}
