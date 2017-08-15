"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runCloudTravel = runCloudTravel;

var _cloudTravel = require("./services/cloudTravel");

function runCloudTravel(config) {
    return new Promise(function (resolve, reject) {
        config.inputDetails.map(function (val, key) {
            var cloudRouterServiceObject = new _cloudTravel.cloudTravel(val.latArr, val.longArr, val.ValidPorts, val.start, val.end),
                calcShortestTrip = cloudRouterServiceObject.calcShortestTrip.bind(cloudRouterServiceObject);

            calcShortestTrip().then(function (res) {
                console.log("RESULT of input ", key, " => ", res);
            }).catch(function (err) {
                console.log("Err in input ", key, " => ", err);
                reject(err);
            });
        });
        resolve();
    });
}
//# sourceMappingURL=index.js.map
