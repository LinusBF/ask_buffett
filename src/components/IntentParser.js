/**
 * Created by Linus on 2018-06-10.
 */

export const parseIntent = (intent, content) => {
    switch (intent){
        case "stock_price":
            return priceMsg(content);
        case "stock_currency":
            return currencyMsg(content);
        case "stock_information":
            return informationMsg(content);
        case "stock_historical_avg":
            return historicalAvg(content);
        case "stock_historical_max":
            return historicalMax(content);
        case "stock_historical_min":
            return historicalMin(content);
        default:
            return "Couldn't understand that sentence, sorry!";
    }
}

const priceMsg = (content) => {
    const stock = content;
    return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock";
}

const currencyMsg = (content) => {
    const stock = content;
    return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
}

const informationMsg = (content) => {
    const stock = content;
    const mCap = (cap) => {
        if(parseInt(cap) > 999999999){
            return (parseFloat(cap) / 1000000000).toFixed(3) + "(B)";
        } else if(cap > 999999){
            return (parseFloat(cap) / 1000000).toFixed(3) + "(M)";
        } else if(cap > 999){
            return (parseFloat(cap) / 1000).toFixed(3) + "(Th)";
        } else{
            return parseInt(cap);
        }
    }
    return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock."
        + " Todays change is/was " + stock.day_change + stock.currency + " and it 52-week high was " + stock["52_week_high"] + stock.currency + "."
        + " The company has a market cap of " + mCap(stock.market_cap) + " " + stock.currency;
}

const historicalAvg = (content) => {
    const stock = content.stock;
    const history = content.history;
    const dates = content.dates;
    return stock.name + " (" + stock.symbol + ") had a growth of " + history.totalGrowth.toFixed(2) + stock.currency
        + " and had an average daily growth of " + history.avgDailyGrowth.toFixed(2) + stock.currency + "\n"
        + "(Period " + dates.from.toISOString().slice(0, 10) + " - " + dates.to.toISOString().slice(0, 10) + ")";
}

const historicalMax = (content) => {
    const stock = content.stock;
    const history = content.history;
    return stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
}

const historicalMin = (content) => {
    const stock = content.stock;
    const history = content.history;
    return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
}