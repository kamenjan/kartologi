TODO:
    - remove passport. i can generate my own jwt tokens
     -test cors!!! same domain (localhost) behaves differently, this is important for requests that have modified headers (authorization: jwt_token). this generates preflight OPTIONS request and has to be handled accordingly. native express solution: http://johnzhang.io/options-request-in-express. cors package: https://www.npmjs.com/package/cors#configuration-options