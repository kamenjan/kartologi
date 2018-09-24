KARTOLOGI

Description:

MERN stack based CMS solution for my friends Tragic The Gathering club.
Current CMS is built using Wordpress @ http://kartologi.com/

User specifications:
    - login using (1) pre-made account
    - add/edit/delete new posts
    - upload and parse wer data files (tournament data)
    - deck lists and https://scryfall.com/ API integration
    - calendar with basic CRUD functionality
    
Technical specifications:
    
    Stack overview
    
        a nodejs application proxied behind apache server. built using express
        to serve static react files at / and api endpoints at /api/endpoints. 
        There will be only one admin account which means i can safely handle DB 
        specifications using file based SQLite3. react uses router to handle 
        internal routes (todo: should I use express to also handle those routes 
        server side?).
        
        Apache -> Node -> SQLite3 -> Express -> API backend  
                                             -> React frontend

    Apache configuration
    
        Development server:
        
        kartologi.kancelarija.tech -> react client
        kartologi.kancelarija.tech/api/... -> api endpoints
    
        Apache testing settings (after applying open-cert):
        
        <Directory /APP>
            Order Allow,Deny
            Allow from 160.120.25.65 #switch to actual ip, doh
            Allow from 127.0.0.0/8
        </Directory>
        
        source: https://stackoverflow.com/questions/714332/allow-request-coming-from-specific-ip-only       
        and test this domain shit before i loose my mind. 
         
        I'm handling CORS request in middleware/header.js. but are turned off
        since i'll be serving client and api on the same domain. anyway, just test this! 
    
    
    Login/authentication

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

        ## Express-session
        
            stores session data server side and only send session id to client.
            is not meant to be used in production, at least no without backend session 
            storage.
            
            https://glebbahmutov.com/blog/express-sessions/
        
        ## Express-cookies
        
        ## JWT
        
        ## OAuth2


        TODO:
            - test cors live!!! same localhost behaves differently, this is important for requests that have modified headers (authorization: jwt_token). this generates preflight OPTIONS request and has to be handled accordingly. native express solution: http://johnzhang.io/options-request-in-express. cors package: https://www.npmjs.com/package/cors#configuration-options
            - implement salt and password hashing
            - check XSS seurity   
    
    Upload
    
        TODO:
            - put upload in private api
    
  
    