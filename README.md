# Shipping Problem

# Details

    1.App by default will run on 127.0.0.1:8080 (configurable)

# Valid Urls

    1. 127.0.0.1:8080/cloud-cover   (end point configurable) (output - check console)
    2. 127.0.0.1:8080/healthcheck   (checks app health)

# Setup

1. Check the npm packages:

    ```
    npm install
    ```
2. Managing the project with Grunt

* Runs babel:dist

    ```
    grunt
    ```
* Compiles the .es6 files to .js

    ```
    grunt babel:dist


3. Start the application

    ```
    node dist/api.js
    ```
