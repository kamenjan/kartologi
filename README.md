TODO:
    - test cors!!! same domain (localhost) behaves differently, this is important for requests that have modified headers (authorization: jwt_token). this generates preflight OPTIONS request and has to be handled accordingly. native express solution: http://johnzhang.io/options-request-in-express. cors package: https://www.npmjs.com/package/cors#configuration-options
    - put upload in private api
    - implement salt and password hashing 
    
    
    
    
authentication strategy:

1. client form (username, pass) post via https
2. server checks db for match (if true ...)
3. server generates jwt token
4. server uses express-session to send secure session cookie including jwt
(client app has no access to session data (via httpOnly) for security reasons)
5. clients browser sends domain related session back to server

Issue: I cannot get session data (using withCredentials: true in axios) from react client because allow-origin cannot be * wildcard on server for credentials to be sent :( this is no issue since kartologi client will be sitting at a static domain eg. kartologi.kancelarija.tech

apache settings:
<Directory /APP>
    Order Allow,Deny
    Allow from 160.120.25.65
    Allow from 127.0.0.0/8
</Directory>
source: https://stackoverflow.com/questions/714332/allow-request-coming-from-specific-ip-only

kartologi.kancelarija.tech
kartologiapi.kancelarija.tech

and test this domain shit before i loose my mind


express-session:
    https://glebbahmutov.com/blog/express-sessions/