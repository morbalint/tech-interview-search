# Search

## Dev run instruction

1. install node 20.4.0 (e.g. use `asdf`)
1. install yarn (e.g. `corepack enable`)
1. extract the sample dataset into the `backend/dist/` directory 
1. start backend: `cd backend && OMDBAPIKEY=<your-omdb-api-key> yarn dev`
1. start frontend: `cd frontend && yarn start`

## Excuses

* please excuse the blatant security issues such as:
  * outdated node package
  * CORS set to '*'
* please excuse the use of raw html style 