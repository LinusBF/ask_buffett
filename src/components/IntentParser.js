/**
 * Created by Linus on 2018-06-10.
 */

export const parseIntent = (intent, content) => {
    switch (intent){
        case "initial_message":
            return "Ask Buffett something!";
        case "fetch_error":
            return "Buffett couldn't be reached at this time, try again later. (Network error)";
        case "stock_not_find":
            return "Couldn't find any stocks with that name";
        case "no_stock_history":
            return "Couldn't find any historical data on that stock, sorry!";
        case "no_intent":
            return "Couldn't understand that sentence, sorry!";
        case "stock_price":
            return priceMsg(content);
        case "stock_currency":
            return currencyMsg(content);
        case "stock_information":
            return informationMsg(content);
        case "stock_market_cap":
            return marketCap(content);
        case "stock_name_from_ticker":
            return nameFromTicker(content);
        case "stock_ticker_from_name":
            return tickerFromName(content);
        case "stock_historical_avg":
            return historicalAvg(content);
        case "stock_historical_max":
            return historicalMax(content);
        case "stock_historical_min":
            return historicalMin(content);
        default:
            return "Couldn't understand that sentence, sorry!";
    }
};

const mCap = (cap) => {
    const parsedCap = parseFloat(cap);
    if(parsedCap > 999999999){
        return (parsedCap / 1000000000).toFixed(3) + "(B)";
    } else if(cap > 999999){
        return (parsedCap / 1000000).toFixed(3) + "(M)";
    } else if(cap > 999){
        return (parsedCap / 1000).toFixed(3) + "(Th)";
    } else{
        return parseInt(cap);
    }
};

const priceMsg = (content) => {
    const stock = content;
    return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock";
};

const currencyMsg = (content) => {
    const stock = content;
    return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
};

const informationMsg = (content) => {
    const stock = content;
    return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock."
        + " Todays change is/was " + stock.day_change + stock.currency + " and it 52-week high was " + stock["52_week_high"] + stock.currency + "."
        + " The company has a market cap of " + mCap(stock.market_cap) + " " + stock.currency;
};

const marketCap = (content) => {
    const stock = content;
    return "The current market cap of " + stock.name + " (" + stock.symbol + ") is "+ mCap(stock.market_cap) + " " + stock.currency;
};

const nameFromTicker = (content) => {
    const stock = content;
    return "The name of the company with ticker " + stock.symbol + " is " + stock.name;
};

const tickerFromName = (content) => {
    const stock = content;
    return stock.name + " has ticker " + stock.symbol;
};

const historicalAvg = (content) => {
    const stock = content.stock;
    const history = content.history;
    const dates = content.dates;
    return stock.name + " (" + stock.symbol + ") had a growth of " + history.totalGrowth.toFixed(2) + stock.currency
        + " and had an average daily growth of " + history.avgDailyGrowth.toFixed(2) + stock.currency + "\n"
        + "(Period " + dates.from.toISOString().slice(0, 10) + " - " + dates.to.toISOString().slice(0, 10) + ")";
};

const historicalMax = (content) => {
    const stock = content.stock;
    const history = content.history;
    const dates = content.dates;
    return stock.name + " (" + stock.symbol + ") was at its highest point on " + history.maxClose.date
        + " where it reached " + history.maxClose.value + stock.currency + "."
        + " (Period " + dates.from.toISOString().slice(0, 10) + " - " + dates.to.toISOString().slice(0, 10) + ")";
};

const historicalMin = (content) => {
    const stock = content.stock;
    const history = content.history;
    const dates = content.dates;
    return stock.name + " (" + stock.symbol + ") was at its lowest point on " + history.minClose.date
        + " where it reached " + history.minClose.value + stock.currency + "."
        + " (Period " + dates.from.toISOString().slice(0, 10) + " - " + dates.to.toISOString().slice(0, 10) + ")";
};