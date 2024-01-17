import {wordify, WordMap} from "./bootstrap";
import {Str2PositiveUIntSafe} from "./helpers";

const OMDB_API_KEY = process.env.OMDBAPIKEY
const PAGE_SIZE = process.env.PAGE_SIZE || "10";
const pageSize = Str2PositiveUIntSafe(PAGE_SIZE, 10)

type SearchResponse = {
    data: string[]
    next?: string
    prev?: string
}

export function SearchBuilder(wordMap: WordMap) {
    return async (rawSearchTerm: string, pageNumber: number = 0) => {
        const searchTerms = wordify(rawSearchTerm)
        const response = {data: []} as SearchResponse

        if (pageNumber > 0) {
            response.prev = `/search?p=${pageNumber - 1}&q=${encodeURIComponent(rawSearchTerm)}`;
        }

        // Not sure if I should search for all terms individually, so I choose the simpler approach for now.
        // Starting the slow async process ASAP to reduce latency
        const movies = fetch(`http://www.omdbapi.com/?t=${rawSearchTerm}&apikey=${OMDB_API_KEY}`)

        let remainingHits = pageSize
        let hits2skip = pageNumber * pageSize
        let nextPageFound = false
        for (let termIdx = 0; termIdx < searchTerms.length && !nextPageFound; termIdx++) {
            const term = searchTerms[termIdx]
            const hits = wordMap[term] // the actual search
            if (hits === undefined) {
                continue;
            }
            console.log(`found ${hits.length} files for '${term}'`)
            if (hits.length <= hits2skip) {
                hits2skip -= hits.length
                continue;
            }

            const fileFound = hits.slice(hits2skip, hits2skip + remainingHits).map(d => `FILE: ${d.file}`)
            response.data.push(...fileFound)
            remainingHits -= fileFound.length

            if (remainingHits === 0 && hits.length > hits2skip + fileFound.length) {
                response.next = `/search?p=${pageNumber + 1}&q=${encodeURIComponent(rawSearchTerm)}`;
                nextPageFound = true
            }

            hits2skip = 0
        }

        // wait for the slow async process if we actually need it
        if (response.data.length < pageSize) {
            const movieResponse = await(await movies).json() as { Title: string | undefined }
            if (movieResponse.Title != null) {
                response.data.push(`MOVIE: ${movieResponse.Title}`);
            }
        } // in go or C# I would cancel the promise here in an else branch, but a quick search told me I can't do that in JS, so this is a little waste of resources.

        return response
    }
}