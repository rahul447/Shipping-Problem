##Shipping Problem

# App will run on 127.0.0.1:8080

# Valid Urls (127.0.0.1:8080/healthcheck, 127.0.0.1:8080/cloud-cover)
    1. 127.0.0.1:8080/cloud-cover
    2. 127.0.0.1:8080/healthcheck

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
