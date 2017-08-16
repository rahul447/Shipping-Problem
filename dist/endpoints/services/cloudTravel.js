"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cloudTravel = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cloudTravel = exports.cloudTravel = function () {
    function cloudTravel(latArr, longArr, canTravelArr, start, dest) {
        _classCallCheck(this, cloudTravel);

        this.earthRadius = 4000;
        this.latArr = latArr;
        this.longArr = longArr;
        this.canTravelArr = canTravelArr;
        this.start = start;
        this.dest = dest;
    }

    // returns distance b/w 2 airports as per formula


    _createClass(cloudTravel, [{
        key: "calcArcLength",
        value: function calcArcLength(lat1, lat2, lon1, lon2) {

            return this.earthRadius * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        }

        // traverse canTravelMap, calculates Miles Traveled

    }, {
        key: "traverseCanTravelMap",
        value: function traverseCanTravelMap(currentAirport, currTravelPath) {
            var _this = this;

            // only TRUE when dest airport is found
            if (this.canTravelMap.get(currentAirport).indexOf(this.dest) > -1) {

                // so for usecase 1 as per doc, currTravelPath = "0=>2,2=>1"
                currTravelPath += "=>" + this.dest + ",";

                var milesTraveled = 0.0;

                currTravelPath.split(",").map(function (route) {
                    if (route) {
                        milesTraveled += _this.distanceMap.get(route);
                    }
                });

                this.milesTraveled = milesTraveled; //total miles traveled for each use case
            } else {

                this.canTravelMap.get(currentAirport).map(function (canTravelAirport) {
                    currTravelPath += "=>" + canTravelAirport + "," + canTravelAirport;

                    // recursion
                    _this.traverseCanTravelMap(canTravelAirport, currTravelPath);
                });
            }
        }

        // calculates distance between all routes found in each use case (canTravelMap)
        // Eg in case of { 0 => [ 2 ], 1 => [ 0, 2 ], 2 => [ 0, 1 ] }
        // routes will be 0 to 2, 1 to 0, 1 to 2, 2 to 0, 2 to 1

    }, {
        key: "calcTravelDistanceForAllRoutes",
        value: function calcTravelDistanceForAllRoutes() {
            var _this2 = this;

            var distanceMap = new Map();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    value.map(function (canTravelAirport) {

                        var routeDistance = _this2.calcArcLength(_this2.latArr[key], _this2.latArr[canTravelAirport], _this2.longArr[key], _this2.longArr[canTravelAirport]);

                        distanceMap.set(key + "=>" + canTravelAirport, routeDistance);
                    });
                };

                for (var _iterator = this.canTravelMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return distanceMap;
        }

        // main method

    }, {
        key: "shortestCourierTrip",
        value: function shortestCourierTrip() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {

                _this3.validateConstraints().then(function (data) {

                    var startArr = data.canTravelMap.get(_this3.start);

                    // check for -1 route not found
                    // when data.canTravelMap has values like  { 0 => [ 2 ], 2 => [ 0 ] }
                    if (startArr.length === 1 && data.canTravelMap.get(startArr[0]).length === 1 && data.canTravelMap.get(startArr[0])[0] === _this3.start) {

                        resolve(-1); // route not found
                    } else if (_this3.start === _this3.dest) {
                        resolve(0.0); // start airport same as dest airport
                    } else {
                        _this3.canTravelMap = data.canTravelMap;
                        _this3.distanceMap = _this3.calcTravelDistanceForAllRoutes();

                        var currTravelPath = _this3.start;

                        // as this method is call recursively ,
                        // 1st param denotes current airport,2nd param denotes current traveled path
                        _this3.traverseCanTravelMap(_this3.start, currTravelPath);

                        resolve(_this3.milesTraveled);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            });
        }

        // validate constraints on lat, long, canTravel

    }, {
        key: "validateConstraints",
        value: function validateConstraints() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {

                // check constraint 2 as per doc
                if (!(_this4.latArr.length === _this4.longArr.length || _this4.latArr.length === _this4.canTravelArr.length)) {

                    reject("cloudTravel.validate()// " + "Length of latArr, longArr, canTravelArr not Equal");
                } else if (_this4.latArr.length > 20 || _this4.longArr.length > 20 || _this4.canTravelArr.length > 20) {
                    // check constraint 1 as per doc

                    reject("cloudTravel.validate()// " + "Length of latArr or longArr or canTravelArr > 20");
                } else {

                    var latLongMap = new Map(),
                        canTravelMap = new Map();

                    _this4.latArr.map(function (val, key) {

                        // check constraint 3 as per doc
                        if (!_lodash2.default.inRange(val, -89, 90)) {
                            reject("cloudTravel.validate()// " + "Lat val not valid");
                        }

                        latLongMap.set(key, { "lat": val });
                    });

                    _this4.longArr.map(function (val, key) {

                        // check constraint 4 as per doc
                        if (!_lodash2.default.inRange(val, -179, 180)) {
                            reject("cloudTravel.validate()// " + "Long val not valid");
                        }

                        var modObj = latLongMap.get(key);

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = latLongMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _step2$value = _slicedToArray(_step2.value, 2),
                                    value = _step2$value[1];

                                // check constraint 8 as per doc
                                if (modObj.lat === value.lat && val === value.long) {
                                    reject("cloudTravel.validate()// " + "Same Lat long not allowed for two airports");
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        modObj.long = val;
                    });

                    _this4.canTravelArr.map(function (val, key) {

                        var airPortArr = [];

                        val.split(" ").map(function (innerval) {

                            // check constraint 6 as per doc
                            if (!_lodash2.default.inRange(parseInt(innerval), 0, _this4.latArr.length)) {
                                reject("cloudTravel.validate()// " + "canTravelArr val not valid");
                            }

                            airPortArr.push(parseInt(innerval));
                        });

                        canTravelMap.set(key, airPortArr);
                    });

                    // check constraint 7 as per doc
                    if (!(_lodash2.default.inRange(_this4.start, 0, _this4.latArr.length) || _lodash2.default.inRange(_this4.dest, 0, _this4.latArr.length))) {
                        reject("cloudTravel.validate()// " + "start or dest val not valid");
                    }

                    resolve({ latLongMap: latLongMap, canTravelMap: canTravelMap });
                }
            });
        }
    }]);

    return cloudTravel;
}();
//# sourceMappingURL=cloudTravel.js.map
