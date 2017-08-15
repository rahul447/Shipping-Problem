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
    function cloudTravel(latArr, longArr, ValidPorts, start, end) {
        _classCallCheck(this, cloudTravel);

        this.earthRadius = 4000;
        this.latArr = latArr;
        this.longArr = longArr;
        this.ValidPorts = ValidPorts;
        this.start = start;
        this.end = end;
    }

    _createClass(cloudTravel, [{
        key: "calcArcLength",
        value: function calcArcLength(lat1, lat2, lon1, lon2) {
            return this.earthRadius * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        }
    }, {
        key: "iterateMap",
        value: function iterateMap(startpoint, travelPath) {
            var _this = this;

            if (this.validPortsMap.get(startpoint).indexOf(this.end) > -1) {
                travelPath += "=>" + this.end + ",";
                var milesTraveled = 0.0;
                travelPath.split(",").map(function (tval) {
                    if (tval) {
                        milesTraveled += _this.distanceMap.get(tval);
                    }
                });
                this.milesTraveled = milesTraveled;
            } else {
                this.validPortsMap.get(startpoint).map(function (ival) {
                    travelPath += "=>" + ival + "," + ival;
                    _this.iterateMap(ival, travelPath);
                });
            }
        }
    }, {
        key: "calcTravelDistance",
        value: function calcTravelDistance() {
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

                    var mapkey = key + "=>";
                    value.map(function (ipts) {
                        distanceMap.set(mapkey + ipts, _this2.calcArcLength(_this2.latArr[key], _this2.latArr[ipts], _this2.longArr[key], _this2.longArr[ipts]));
                    });
                };

                for (var _iterator = this.validPortsMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    }, {
        key: "calcShortestTrip",
        value: function calcShortestTrip() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.validate().then(function (data) {

                    if (data.validPortsMap.get(_this3.start).length === 1 && data.validPortsMap.get(data.validPortsMap.get(_this3.start)[0]).length === 1 && data.validPortsMap.get(data.validPortsMap.get(_this3.start)[0])[0] === _this3.start) {
                        resolve(-1);
                    } else if (_this3.start === _this3.end) {
                        resolve(0.0);
                    } else {
                        _this3.validPortsMap = data.validPortsMap;
                        _this3.distanceMap = _this3.calcTravelDistance();
                        var travelPath = _this3.start;

                        _this3.iterateMap(_this3.start, travelPath);
                        resolve(_this3.milesTraveled);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: "validate",
        value: function validate() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                if (!(_this4.latArr.length === _this4.longArr.length || _this4.latArr.length === _this4.ValidPorts.length)) {
                    reject("cloudTravel.validate()// " + "Length of Lat, Long, ValidPorts not Equal");
                } else if (_this4.latArr.length > 20 || _this4.longArr.length > 20 || _this4.ValidPorts.length > 20) {
                    reject("cloudTravel.validate()// " + "Length of Lat or Long or ValidPorts > 20");
                } else {
                    var latLongMap = new Map(),
                        validPortsMap = new Map();

                    _this4.latArr.map(function (val, key) {
                        if (!_lodash2.default.inRange(val, -89, 90)) {
                            reject("cloudTravel.validate()// " + "Lat val not valid");
                        }
                        latLongMap.set(key, { "lat": val });
                    });

                    _this4.longArr.map(function (val, key) {
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

                    _this4.ValidPorts.map(function (val, key) {
                        var validPortArr = [];

                        val.split("|").map(function (innerval) {
                            if (!_lodash2.default.inRange(parseInt(innerval), 0, _this4.latArr.length)) {
                                reject("cloudTravel.validate()// " + "validPort val not valid");
                            }
                            validPortArr.push(parseInt(innerval));
                        });
                        validPortsMap.set(key, validPortArr);
                    });

                    if (!_lodash2.default.inRange(_this4.start, 0, _this4.latArr.length)) {
                        reject("cloudTravel.validate()// " + "start val not valid");
                    }

                    if (!_lodash2.default.inRange(_this4.end, 0, _this4.latArr.length)) {
                        reject("cloudTravel.validate()// " + "end val not valid");
                    }
                    resolve({ latLongMap: latLongMap, validPortsMap: validPortsMap });
                }
            });
        }
    }]);

    return cloudTravel;
}();
//# sourceMappingURL=cloudTravel.js.map
