# Search

## Simple run instructions

1. install docker
1. set your OMDB API key in `docker-compose.yaml`
1. run the whole thing with `docker compose up`
1. go to http://localhost:3000/ 

## Dev run instruction

1. install node 20.4.0 (e.g. use `asdf`)
1. install yarn (e.g. `corepack enable`)
1. extract the sample dataset into the `backend/dist/` directory 
1. start backend: `cd backend && OMDBAPIKEY=<your-omdb-api-key> yarn dev`
1. start frontend: `cd frontend && yarn start`

## Excuses

* not counting clicks on movies because the spec states "rank documents" (maybe added later)
  * so movies are not clickable because this is not a UX exercise
* cheating by moving the movie search to the bottom of the results, so we don't need to wait for the slow API
* concurrent updates not handled (single threaded nodejs should take care of that on this scale)
* pagination is not perfect, when concurrent users raise a document in rank by clicking, pagination can skip that document or a show another document twice  

* please excuse the blatant security issues such as:
  * no HTTPS
  * outdated node package (potentially)
  * CORS Allow Origin set to '*'
  * user input sanitization
* please excuse the use of raw html style, no time for UX 