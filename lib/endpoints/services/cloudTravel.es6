"use strict";
import _ from "lodash";

export class cloudTravel {

    constructor(latArr, longArr, ValidPorts, start, end) {
        this.earthRadius = 4000;
        this.latArr = latArr;
        this.longArr = longArr;
        this.ValidPorts = ValidPorts;
        this.start = start;
        this.end = end;
    }

    calcArcLength(lat1, lat2, lon1, lon2) {
        return this.earthRadius * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1)
                * Math.cos(lat2) * Math.cos(lon1 - lon2))
    }

    iterateMap(startpoint, travelPath) {

        if(this.validPortsMap.get(startpoint).indexOf(this.end) > -1) {
            travelPath += "=>" + this.end + ",";
            let milesTraveled = 0.0;
            travelPath.split(",").map((tval) => {
                if(tval){
                    milesTraveled += this.distanceMap.get(tval);
                }
            });
            this.milesTraveled = milesTraveled;
        }else {
            this.validPortsMap.get(startpoint).map((ival) => {
                travelPath += "=>" + ival + "," + ival;
                this.iterateMap(ival, travelPath);
            });
        }
    }

    calcTravelDistance() {
        let distanceMap = new Map();
        for (let [key, value] of this.validPortsMap) {
            let mapkey = key + "=>";
            value.map((ipts) => {
                distanceMap.set(mapkey + ipts, this.calcArcLength(this.latArr[key],
                    this.latArr[ipts], this.longArr[key], this.longArr[ipts]))
            });
        }
        return distanceMap;
    }

    calcShortestTrip() {
        return new Promise((resolve,reject) => {
            this.validate().then((data) => {

                if(data.validPortsMap.get(this.start).length === 1
                    && data.validPortsMap.get(data.validPortsMap.get(this.start)[0]).length === 1 && data.validPortsMap.get(data.validPortsMap.get(this.start)[0])[0] === this.start) {
                    resolve(-1);
                } else if(this.start === this.end) {
                    resolve(0.0);
                } else{
                    this.validPortsMap = data.validPortsMap;
                    this.distanceMap = this.calcTravelDistance();
                    let travelPath = this.start;

                    this.iterateMap(this.start, travelPath);
                    resolve(this.milesTraveled);
                }

            }).catch(err => {
                reject(err);
            });
        });
    }

    validate() {
        return new Promise((resolve, reject) => {
            if(!(this.latArr.length === this.longArr.length ||
                this.latArr.length === this.ValidPorts.length)) {
                reject("cloudTravel.validate()// " +
                    "Length of Lat, Long, ValidPorts not Equal");
            }else if(this.latArr.length > 20 || this.longArr.length > 20
                || this.ValidPorts.length > 20) {
                reject("cloudTravel.validate()// " +
                    "Length of Lat or Long or ValidPorts > 20");
            }else {
                let latLongMap = new Map(),
                validPortsMap = new Map();

                this.latArr.map((val, key) => {
                    if(!_.inRange(val, -89, 90)){
                        reject("cloudTravel.validate()// " +
                            "Lat val not valid");
                    }
                    latLongMap.set(key, {"lat": val});
                });

                this.longArr.map((val, key) => {
                    if(!_.inRange(val, -179, 180)){
                        reject("cloudTravel.validate()// " +
                            "Long val not valid");
                    }

                    let modObj = latLongMap.get(key);

                    for (let [, value] of latLongMap) {

                        if(modObj.lat === value.lat && val === value.long) {
                            reject("cloudTravel.validate()// " +
                                "Same Lat long not allowed for two airports");
                        }
                    }

                    modObj.long = val;
                });

                this.ValidPorts.map((val, key) => {
                    let validPortArr = [];

                    val.split("|").map((innerval) => {
                        if(!(_.inRange(parseInt(innerval), 0, this.latArr.length))) {
                            reject("cloudTravel.validate()// " +
                                "validPort val not valid");
                        }
                        validPortArr.push(parseInt(innerval));
                    });
                    validPortsMap.set(key, validPortArr);
                });

                if(!(_.inRange(this.start, 0, this.latArr.length))) {
                    reject("cloudTravel.validate()// " +
                        "start val not valid");
                }

                if(!(_.inRange(this.end, 0, this.latArr.length))) {
                    reject("cloudTravel.validate()// " +
                        "end val not valid");
                }
                resolve({latLongMap, validPortsMap});
            }
        });
    }
}

