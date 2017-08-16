"use strict";

// eslint disable no-var

let config = {
    "http": {
        "protocol": "http",
        "domain": "127.0.0.1",
        "port": 8010
    },
    "urlPrefix": "/cloud-cover",
    "inputDetails":[
        {
            "latArr": [0, 0, 70],
            "longArr": [90, 0, 45],
            "canTravelArr": ["2", "0 2","0 1"],
            "start": 0,
            "dest": 1
        },
        {
            "latArr": [0, 0, 70],
            "longArr": [90, 0, 45],
            "canTravelArr": ["1 2", "0 2","0 1"],
            "start": 0,
            "dest": 1
        },
        {
            "latArr": [0, 30, 60],
            "longArr": [25, -130, 78],
            "canTravelArr": ["1 2", "0 2","1 2"],
            "start": 0,
            "dest": 0
        },
        {
            "latArr": [0,20,55],
            "longArr": [-20,85,42],
            "canTravelArr": ["1", "0","0"],
            "start": 0,
            "dest": 2
        }
    ]
};

module.exports = config;

// eslint enable no-var
