import express from "express";
import fs from "fs/promises";

type FileData = { [key: string]: string }
type WordifiedDataset = { [key: string]: string[] }

// Map was considered, but rejected because performance for this use should be the same, but serializing Map is more difficult.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
// Built in data structures are usually good enough at this scale, and I'm not familiar with TS enough to create purpose built custom data types.
// In a team I would ask for a second opinion here, to see if it's worth spending more time on.
type WordData = { file: string, clicks: number }
type WordMap = { [key: string]: WordData[] }

type ResponseData = { data: string[] }

async function basicTextDataSet() {
    const fileData = Object.create(null as (object | null)) as FileData // Jetbrains built in typechecker is stupid
    const basicTextDir = './dist/datasets/basic_text/'
    const files = await fs.readdir(basicTextDir)
    if (files.length === 0) {
        console.error(`Error reading directory: ${basicTextDir}`)
        return;
    }
    for (const file of files) {
        fileData[file] = await fs.readFile(basicTextDir + file, {encoding: 'utf8'})
    }
    return fileData
}

function wordify(text: string): string[] {
    return text.split(RegExp(`[\\s .:,;?!'"-]`)).filter(x => x !== "").map(x => x.toLowerCase())  // simplifying lowercase
}

function wordifyDataSet(fileData: FileData): WordifiedDataset {
    const ds = Object.create(null as (object | null)) as WordifiedDataset; // Jetbrains built in typechecker is stupid
    for (const file in fileData) {
        const data = fileData[file]
        ds[file] = wordify(data)
    }
    return ds
}

function prep4search(dataset: WordifiedDataset): WordMap {
    const wordMap = Object.create(null as (object | null)) as WordMap // Jetbrains built in typechecker is stupid

    for (const file in dataset) {
        for (const word of dataset[file]) {
            if (wordMap[word] === undefined) {
                wordMap[word] = [{file, clicks: 0}]
            } else if (!wordMap[word].find(x => x.file === file)) {
                wordMap[word].push({file, clicks: 0})
            }
        }
    }

    return wordMap;
}

export async function BootstrapApp() {
    const app = express();

    const omdbApiKey = process.env.OMDBAPIKEY

    const dataset = await basicTextDataSet();
    if (dataset && Object.keys(dataset).length === 0) {
        console.error("Failed to load dataset!")
        return;
    }
    console.log('Dataset successfully retrieved!')
    const wordifiedDataset = wordifyDataSet(dataset as FileData)
    // console.debug(wordifiedDataset)
    const wordMap = prep4search(wordifiedDataset)
    // console.debug(wordMap)
    console.log('Search optimized data structure built!')

    app.get('/search', async (req, res) => {
        const rawSearchTerm = (req.query as { q: string }).q // simplifying
        console.debug(`search term: ${rawSearchTerm}`)
        const searchTerm = wordify(rawSearchTerm)

        res.setHeader('Access-Control-Allow-Origin', '*')

        const responseData = {data: []} as ResponseData

        const movies = fetch(`http://www.omdbapi.com/?t=${rawSearchTerm}&apikey=${omdbApiKey}`)

        for (const term of searchTerm) {
            if (wordMap[term] !== undefined) {
                console.log("files found!")
                const fileFound = wordMap[term].map(d => `FILE: ${d.file}`)
                responseData.data.push(...fileFound)
            }
        }

        const movieResponse = await (await movies).json() as {Title: string | undefined}
        if (movieResponse.Title != null) {
            responseData.data.push(`MOVIE: ${movieResponse.Title}`);
        }

        res.send(responseData)
    });
    return app;
}