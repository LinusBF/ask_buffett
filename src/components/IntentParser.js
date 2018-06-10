/**
 * Created by Linus on 2018-06-10.
 */

export const parseIntent = (intent, content) => {
    let stock;

    switch (intent){
        case "stock_price":
            return priceMsg(content);
        case "stock_currency":
            stock = content;
            return currencyMsg(content);
        case "stock_information":
            stock = content;
            return informationMsg(content);
        case "stock_historical_avg":
            stock = content;
            return historicalAvg(content);
        case "stock_historical_max":
            stock = content;
            return historicalMax(content);
        case "stock_historical_min":
            stock = content;
            return historicalMin(content);
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
    return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock";
}

const historicalAvg = (content) => {
    const stock = content;
    return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
}

const historicalMax = (content) => {
    const stock = content;
    return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
}

const historicalMin = (content) => {
    const stock = content;
    return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
}