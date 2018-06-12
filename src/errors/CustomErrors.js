/**
 * Created by Linus on 2018-06-12.
 */

export const NoIntentError = (error) => {
    this.intent = "no_intent";
    this.error = error;
    return this;
}

export const StockNotFoundError = (error) => {
    this.intent = "stock_not_find";
    this.error = error;
    return this;
}
