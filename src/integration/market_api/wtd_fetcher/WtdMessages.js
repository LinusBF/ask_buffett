/**
 * Created by Linus on 2018-06-09.
 */

class WtdMessages{
    static stockPriceMsg(stock){
        return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock";
    }

    static stockCurrencyMsg(stock){
        return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
    }

    static stockGeneralInfo(stock){
        return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock";
    }

    static stockHistoricalAvgMsg(data, dateStart, dateEnd, stock){
        console.log(data);
        console.log(dateStart);
        console.log(dateEnd);
        console.log(stock);
        return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
    }

    static stockHistoricalMaxMsg(data, dateStart, dateEnd, stock){
        return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
    }

    static stockHistoricalMinMsg(data, dateStart, dateEnd, stock){
        return "The stock for  " + stock.name + " (" + stock.symbol + ") is traded with " + stock.currency;
    }

    static couldNotFindStock(){
        return "I could not find any stocks with that name, maybe they are listed under a parent company?";
    }

    static couldNotConnectToAPI(){
        return "Sorry! I can't reach my friend that has all the financial data :(\n Try again later (API error)";
    }
}

export default WtdMessages;
