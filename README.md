TODO:
    - test cors!!! same domain (localhost) behaves differently, this is important for requests that have modified headers (authorization: jwt_token). this generates preflight OPTIONS request and has to be handled accordingly. native express solution: http://johnzhang.io/options-request-in-express. cors package: https://www.npmjs.com/package/cors#configuration-options
    - put upload in private api
    - implement salt and password hashing
    - check XSS seurity   
    
    
authentication strategy:

backend api and react client server will be served on same domain.
one express instance will serve static frontend react client on root and 
api endpoints on other paths. this should prevent any conflicts regarding 
request/response data and metadata that are produced by CORS communication.

1. client form (username, pass) post via https
2. server checks db for match (if true ...)
3. 
    1. express-session with server side session storage (HTTP only) || 
    2. express-cookie sent with data to client (HTTP only) ||
    3. jwt token using header authorization metadata (HTTP only?) 

Issue: I cannot get session data (using withCredentials: true in axios) from react client because allow-origin cannot be * wildcard on server for credentials to be sent :( this is no issue since kartologi client will be sitting at a static domain eg. kartologi.kancelarija.tech
https://stackoverflow.com/questions/39909419/jwt-vs-oauth-authentication

apache testing settings (after applying open-cert):
<Directory /APP>
    Order Allow,Deny
    Allow from 160.120.25.65 #switch to actual ip, doh
    Allow from 127.0.0.0/8
</Directory>
source: https://stackoverflow.com/questions/714332/allow-request-coming-from-specific-ip-only

kartologi.kancelarija.tech
kartologiapi.kancelarija.tech

and test this domain shit before i loose my mind

## Express-session

stores session data server side and only send session id to client.
is not meant to be used in production, at least no without backend session 
storage.

https://glebbahmutov.com/blog/express-sessions/

## Express-cookies

## JWT

## OAuth2

    