"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _index = require("./endpoints/index");

var _expressDomainMiddleware = require("express-domain-middleware");

var _expressDomainMiddleware2 = _interopRequireDefault(_expressDomainMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = Object.freeze(require("../config/config")),
    app = (0, _express2.default)(),
    urlPrefix = config.urlPrefix;

// Sets the relevant config app-wise
app.use(_expressDomainMiddleware2.default);
app.set("port", config.http.port);
app.set("domain", config.http.domain);
app.use(_bodyParser2.default.json());

app.get("/healthcheck", function (req, res) {
    res.status(200).send("OKYE");
});

app.get("" + urlPrefix, function (req, res) {
    (0, _index.runCloudTravel)(config).then(function () {
        res.status(200).send("Check Console");
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

// Starts the app

app.listen(app.get("port"), app.get("domain"), function () {
    console.log("Server has started and is listening on port: " + app.get("port") + " and ip : " + app.get("domain"));
});

module.exports = app;
//# sourceMappingURL=api.js.map
