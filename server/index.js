"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = 3000;
;
;
var db = {};
function addData(id, data) {
    if (!Object.keys(db).includes(id)) {
        db[id] = [{ data: data, timestamp: Date.now() }];
    }
    else {
        db[id].append({ data: data, timestamp: Date.now() });
    }
}
app.get('/', function (req, res) {
    var html = '<html><head><title>Moisture Server!</title></head><body><h1>Moisture Server!</h1>';
    for (var id in db) {
        html += "<div><h2>" + id + "</h2><table><tr><th>Timestamp</th><th>Moisture</th></tr>";
        for (var _i = 0, _a = db[id]; _i < _a.length; _i++) {
            var value = _a[_i];
            html += "<tr><td>" + new Date(value.timestamp) + "</td><td>" + value.data.moisture + "</td></tr>";
        }
        html += '</table></div>';
    }
    html += '</body></html>';
    res.send(html);
});
app.post('/', express.urlencoded({ extended: false }));
app.post('/', function (req, res) {
    if (req.body) {
        if (req.body.id) {
            var id = req.body.id;
            var data = {};
            for (var key in req.body) {
                if (key !== 'id') {
                    data[key] = req.body[key];
                }
            }
            addData(id, data);
        }
    }
    res.sendStatus(200);
});
app.listen(port, function () {
    console.log("Moisture Server listening at http://localhost:" + port);
});
