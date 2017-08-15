"use strict";
import express from "express";
import bodyParser from "body-parser";
import {runCloudTravel} from "./endpoints/index";
import domain from "express-domain-middleware";

let config = Object.freeze(require("../config/config")),
  app = express(),
  urlPrefix = config.urlPrefix;

// Sets the relevant config app-wise
app.use(domain);
app.set("port", config.http.port);
app.set("domain", config.http.domain);
app.use(bodyParser.json());

app.get("/healthcheck", (req, res) => {
    res.status(200).send("OKYE");
});

app.get(`${urlPrefix}`, (req, res) => {
    runCloudTravel(config).then(() => {
        res.status(200).send("Check Console");
    }).catch(err => {
        res.status(404).send(err);
    });
});

// Starts the app

app.listen(app.get("port"), app.get("domain"), function () {
  console.log("Server has started and is listening on port: " + app.get("port") + " and ip : " + app.get("domain"));
});

module.exports = app;
