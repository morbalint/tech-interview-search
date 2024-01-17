import express from "express";
import {Str2PositiveUIntSafe} from "./helpers";
import {loadTextDataSet, FileData, prep4search, wordifyDataSet} from "./bootstrap";
import {SearchBuilder} from "./search";


export async function BootstrapApp() {
    const app = express();

    const dataset = await loadTextDataSet();
    if (dataset && Object.keys(dataset).length === 0) {
        console.error("Failed to load dataset!")
        return;
    }
    console.log('Dataset successfully retrieved!')
    const wordifiedDataset = wordifyDataSet(dataset as FileData)
    const wordMap = prep4search(wordifiedDataset)
    console.log('Search optimized data structure built!')
    const search = SearchBuilder(wordMap)

    app.get('/search', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')

        const rawSearchTerm = req.query['q'] as string
        const pageStr = req.query['p'] as string
        const pageNumber = Str2PositiveUIntSafe(pageStr, 0)
        const responseData = await search(rawSearchTerm, pageNumber)

        res.send(responseData)
    });
    return app;
}