# Kartologi server

Node backend API for my friends Tragic The Gathering club web application.

(M)ERN stack based CMS solution. Current CMS is built using Wordpress @ http://kartologi.com/

## Getting Started

### Prerequisites

Node, npm, nodemon

### Installing
```
$ npm install
```

### Running

Check package.json for scripts, but mainly
``` 
$ npm start-dev
```
for development environment with code watch + hot reloading and
```
$ npm run start 
```
for static production build

#### Description

MERN stack based CMS solution for my friends Tragic The Gathering club.
Current CMS is built using Wordpress @ http://kartologi.com/

### Specifications

1. User specifications
    * login using (1) pre-made account
    * add/edit/delete new posts
    * upload and parse wer data files (tournament data)
    * deck lists and [scryfall](https://scryfall.com) API integration
    * calendar with basic CRUD functionality
    
2. Technical specifications
    
    * Stack overview
    
        a node application proxied behind apache server. built using express to serve react PWA at /, express generated admin GUI at /admin and api endpoints at /api/endpoints. There will be only one admin account which means i can safely handle DB specifications using file based SQLite3. react uses router to handle internal routes (todo: should I use express to also handle those routes server side?).
        
    * Stack structure
        
        * ubuntu
            * apache
                * sqlite
                * node
                    * express
                        * react PWA
                        * plain admin GUI
                        * API endpoints
                        
### Issues, findings, notes & todos
    
#### Sources:
    
https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1

#### Apache configuration

Development server:

kartologi.kancelarija.tech -> react client

kartologi.kancelarija.tech/api/... -> api endpoints

Apache virtual host dev server conf (after applying open-cert):
```
<Location />
    Order Allow,Deny
    Allow from 160.120.25.65 #switch to actual ip, doh
    Allow from 127.0.0.0/8
</Location>
```
                
I'm handling potential CORS requests in middleware/header.js. but are 
turned off since i'll be serving client and api on the same domain. 
anyway, just test this! 
    
    
#### Login/authentication

backend api and react client server will be served on same domain.
one express instance will serve static frontend react client on root and 
api endpoints on other paths. this should prevent any conflicts regarding 
request/response data and metadata that are produced by CORS communication.

1. client form (username, pass) post via https
2. server checks db for match (if true ...)
3. express-cookie sent with data to client (HTTP only)
        
Issue: I cannot get session data (using withCredentials: true in axios) from react client because allow-origin cannot be * wildcard on server for credentials to be sent :( this is no issue since kartologi client will be sitting at a static domain eg. kartologi.kancelarija.tech

https://stackoverflow.com/questions/39909419/jwt-vs-oauth-authentication


https://expressjs.com/en/advanced/best-practice-security.html

* Express-session
    * stores session data server side and only send session id to client. is not meant to be used in production, at least no without backend session storage. https://glebbahmutov.com/blog/express-sessions/
* Express-cookies
* JWT
* OAuth2


TODO:
* test cors live! same localhost behaves differently, this is important for requests that have modified headers (authorization: jwt_token). this generates preflight OPTIONS request and has to be handled accordingly. native express solution: http://johnzhang.io/options-request-in-express. cors package: https://www.npmjs.com/package/cors#configuration-options
* implement salt and password hashing
* check XSS seurity   

    
  
    