"use strict";

import {cloudTravel} from "./services/cloudTravel";

export function runCloudTravel(config) {

    return new Promise((resolve, reject) => {

        //looping through all use cases set in config
        config.inputDetails.map((val, key) => {

            let cloudRouterServiceObject = new cloudTravel(val.latArr, val.longArr,
                        val.canTravelArr, val.start, val.dest),

                shortestCourierTrip = cloudRouterServiceObject.shortestCourierTrip
                                    .bind(cloudRouterServiceObject);

            shortestCourierTrip().then((res) => {
                console.log("RESULT of input ", key , " => ", res);
            }).catch(err => {
                console.log("Err in input ", key, " => ", err);
                reject(err);
            });
        });

        resolve();
    });
}
