/**
 * Created by Linus on 2018-06-08.
 */

var parse = require('csv-parse');
var stocks = "http://linusbf.com/storage/stocklist.csv";

var StocksMeta = [];
var request = new XMLHttpRequest();
request.open("GET", stocks, true);
request.send(null);
request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
        parse(request.responseText, {comment: '#'}, function(err, data){
            data.forEach(function (line) {
                var metaData = {symbol: line[0], name: line[1], cur: line[2]};
                StocksMeta.push(metaData);
            })
        });
    }
};

export default StocksMeta;
