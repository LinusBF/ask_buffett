/**
 * Created by Linus on 2018-06-08.
 */

import WtdFetcher from "./wtd_fetcher/WtdFetcher";
import Secrets from "../../utils/secrets";
import StocksMeta from "./StocksMeta";


export default class MarketApi{
    constructor(witApi, fetcher = MarketApi.Fetchers.DEFAULT){
        this.currentFetcher = fetcher;
        this.witApi = witApi;
        this.stocksMeta = StocksMeta;
    }

    getResponse(query, callback){
        this.witApi.getWitResponse(query, this.handleWitResponse.bind(this, callback))
    }

    handleWitResponse(registerResponse, witResponse){
        //TODO - use fetcher to get answer
        console.log(witResponse.entities.intent[0].value);
        if(witResponse.entities.intent[0].value === "stock_information_get"){
            this._handleStockPrice(registerResponse, witResponse);
        }
    }

    _handleStockPrice(registerResponse, witResponse){
        var stocks = this.getStockTickets(witResponse.entities.search_query[0].value);
        var symbols = [];
        stocks.forEach((stock) => symbols.push(stock.symbol));
        this.currentFetcher.getStockPrice(symbols, registerResponse);
    }

    getStockTickets(stockName){
        var matchingStocks = this.stocksMeta.filter(function (stockMeta) {
            return stockMeta.name.toLowerCase().includes(stockName.toLowerCase());
        });

        return matchingStocks;
        /* UNUSED FILTER METHOD
        if(matchingStocks.length === 1){
            return matchingStocks[0].symbol;
        }

        var usdStock = matchingStocks.find((stockMeta) => stockMeta.cur === "USD");
        var matchingStock = null;
        if(usdStock === undefined){
            matchingStock = matchingStocks.find((stockMeta) => stockMeta.cur === "EUR");
        } else{
            matchingStock = usdStock;
        }

        if(matchingStock !== undefined) {
            return matchingStock.symbol;
        } else{
            return null;
        }*/
    }
}

MarketApi.Fetchers = {DEFAULT: new WtdFetcher(Secrets.Wtd), TENSOR:""};
