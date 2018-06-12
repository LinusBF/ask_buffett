/**
 * Created by Linus on 2018-06-08.
 */

import Parse from "../../thirdParty/csv-parse";
const stocks = "https://linusbf.com/storage/stocklist.csv";

let StocksMeta = [];
let request = new XMLHttpRequest();
request.open("GET", stocks, true);
request.send(null);
request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
        Parse(request.responseText, {comment: '#'}, (err, data) => {
            data.forEach((line) => {
                const metaData = {symbol: line[0], name: line[1], cur: line[2]};
                StocksMeta.push(metaData);
            })
        });
    }
};

export default StocksMeta;
