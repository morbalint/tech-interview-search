# Search

## Dev run instruction

1. install node 20.4.0 (e.g. use `asdf`)
1. install yarn (e.g. `corepack enable`)
1. extract the sample dataset into the `backend/dist/` directory 
1. start backend: `cd backend && OMDBAPIKEY=<your-omdb-api-key> yarn dev`
1. start frontend: `cd frontend && yarn start`

## Excuses

* not counting clicks on movies because the spec states "rank documents" (maybe added later)
* cheating by moving the movie search to the bottom of the results, so we don't need to wait for the slow API
* pagination is not perfect, when concurrent users raise a document by clicking

* please excuse the blatant security issues such as:
  * outdated node package
  * CORS set to '*'
* please excuse the use of raw html style 