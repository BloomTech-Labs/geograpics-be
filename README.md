# GEOGRAPICS

* Backend uses Node.js with Express, and an SQLite3 server.  Heroku plugin used on hosting site to convert the database to PostGres

* Users come to the site and are routed through Instagram's verification/login process, using passport.  Once verified, Instagram sends the user's data to the database

* Two tables have been created - users and pictures. 
    - Users table stores users who have passed through the Passport/Instagram authentication process
    - Pictures table stores their data from Instagram once they've authorized the Geograpics app in their Instagram file

* Full CRUD functionality has been created at two endpoints/routers
    - /users and /map
    - functions for user router are found in userHelper.js, functions for picture router are found in pictureHelper.js
    - Both endpoints are behind a token checking authentication file

* A third router, authRouter, is for Passport & Instagram to verify users
    - Users first hit the /instagram router endpoint, and pass through the passport.authenticate function
    - They're then automatically routed to the /instagram/callback endpoints, where our database starts adding them

* At the /instagram/callback endpoint, Instagram sends back user data, such as username, instagram id, an access token, user's bio, etc, which we save in the database
    - if a user already exists in the database, helper.findUserById finds them and they're routed to the front end preloader, which sends them to the dashboard
    - if they do not exist, the .catch activates, and helper.postNewUser adds their Instagram data to the database, then runs helper.findUserById to locate them and send front end their token.

## Server

Rundown of file structure:
 * api 
    - server file + Jest test files
 * data
    - migration tables, seed files, database config file, and database
 * middleware - where the authentication token is decoded
    * Token generated in security file, /security/gen-token.js
    * auth-middlware.js is imported into server.js as tokenCheck, used on the /user and /map endpoints for security
* router_auth
    - authentication folder.  Where passport routes user and returning users through instagram's verification URLs/process
    - /instagram -> routed to ./instagram/callbak, where backend starts working
* router_Pictures
    - router + helper functions for the /map endpoint
* router_User
    - router + helper functions for the /user endpoint
* security
    - JS file that generates the token front end uses for user identification

