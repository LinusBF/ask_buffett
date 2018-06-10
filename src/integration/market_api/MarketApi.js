/**
 * Created by Linus on 2018-06-08.
 */

import WtdFetcher from "./wtd_fetcher/WtdFetcher";
import Secrets from "../../utils/secrets";
import StocksMeta from "./StocksMeta";
import { getWitResponse } from "../wit_api/WitApi";

const wtdFetcher = new WtdFetcher(Secrets.Wtd);


export async function getResponse(query){
    const witResponse = await getWitResponse(query);
    const response = await _handleWitResponse(witResponse);
    return response;
}

async function _handleWitResponse(witResponse){
    console.log(witResponse);
    if(witResponse.entities.intent === undefined){
        return Error("No intent in user message");
    }
    console.log(witResponse.entities.intent[0].value);
    const intent = witResponse.entities.intent[0].value;

    let queryFunc;
    let fetchFunc;

    switch (intent){
        case "stock_price" || "stock_currency" || "stock_information":
            queryFunc = _queryRealTimeData;
            fetchFunc = wtdFetcher.getStockRealTime;
            break;
        case "stock_historical_avg" || "stock_historical_max" || "stock_historical_min":
            queryFunc = _queryHistoricalData;
            fetchFunc = wtdFetcher.getStockHistorical;
            break;
        default:
            break;
    }

    return {responseData: await queryFunc(witResponse, fetchFunc), intent: intent};
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
            console.log(filteredStocks);
            if (filteredStocks.length > 0) {
                symbols = [];
                filteredStocks[0].forEach((stock) => symbols.push(stock.symbol));
            }
        }
        console.log(symbols);
        dateStart = new Date(witResponse.entities.datetime[0].from.value.slice(0,10));
        dateEnd = new Date(witResponse.entities.datetime[0].to.value.slice(0,10));
    }

    let symbol = symbols[0]; //Historical fetches can only handle one symbol

    return await fetcherFunc(symbol, dateStart, dateEnd);
}

function _getStockSymbols(stockName){
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

function _filterStocksByCurrency(stocks, currencyOrder){
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
