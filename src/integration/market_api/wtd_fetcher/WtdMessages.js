/**
 * Created by Linus on 2018-06-09.
 */

class WtdMessages{
    static stockPriceMsg(stock){
        return "The current value of " + stock.name + " (" + stock.symbol + ") is " + stock.price + stock.currency + " per stock";
    }

    static couldNotFindStock(){
        return "I could not find any stocks with that name, maybe they are listed under a parent company?";
    }
}

export default WtdMessages;
