import express from "express";
import {Str2PositiveUIntSafe} from "./helpers";
import {loadTextDataSet, prep4search, wordifyDataSet} from "./bootstrap";
import {SearchBuilder} from "./search";

export async function BootstrapApp() {
    const app = express();

    const dataset = await loadTextDataSet();
    if (!dataset || Object.keys(dataset).length === 0) {
        console.error("Failed to load dataset!")
        return;
    }
    console.log('Dataset successfully retrieved!')
    const wordifiedDataset = wordifyDataSet(dataset)
    const wordMap = prep4search(wordifiedDataset)
    console.log('Search optimized data structure built!')
    const search = SearchBuilder(wordMap)

    app.get('/search', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')

        const searchTerm = req.query['q'] as string
        const pageStr = req.query['p'] as string
        const pageNumber = Str2PositiveUIntSafe(pageStr, 0)
        const responseData = await search(searchTerm, pageNumber)

        res.json(responseData)
    });

    app.get('/doc', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')

        const fileName = req.query['name'] as string
        const fileContent = dataset[fileName]
        if (fileContent != null) {
            const words = wordifiedDataset[fileName]
            for (const word of words) {
                const idx = wordMap[word].findIndex(x => x.file === fileName)
                if (idx < 0 || idx > wordMap[word].length) {
                    console.error("invalid word map!")
                } else {
                    wordMap[word][idx].clicks += 1;
                    wordMap[word] = wordMap[word].sort((left, right) => right.clicks - left.clicks)
                }
            }
        }

        res.json({data: fileContent})
    })

    return app;
}