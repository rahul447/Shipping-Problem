"use strict";

import {cloudTravel} from "./services/cloudTravel";

export function runCloudTravel(config) {
    return new Promise((resolve, reject) => {
        config.inputDetails.map((val, key) => {
            let cloudRouterServiceObject = new cloudTravel(val.latArr, val.longArr,
                val.ValidPorts, val.start, val.end),
                calcShortestTrip = cloudRouterServiceObject.
                calcShortestTrip.bind(cloudRouterServiceObject);

            calcShortestTrip().then((res) => {
                console.log("RESULT of input ", key , " => ", res);
            }).catch(err => {
                console.log("Err in input ", key, " => ", err);
                reject(err);
            });
        });
        resolve();
    });
}

