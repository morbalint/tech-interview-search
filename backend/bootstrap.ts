import fs from "fs/promises";

export type FileData = { [key: string]: string }
export type WordifiedDataset = { [key: string]: string[] }

// Built in data structures are usually good enough at this scale, and I'm not familiar with TS enough to create purpose built custom data types.
// In a team I would ask for a second opinion here, to see if it's worth spending more time on.
// Map was considered, but rejected because performance for this use should be the same, but serializing Map is more difficult.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
export type WordData = { file: string, clicks: number }
export type WordMap = { [key: string]: WordData[] }

export function wordify(text: string): string[] {
    return text.split(RegExp(`[\\s .:,;?!'"-/]`)).filter(x => x !== "").map(x => x.toLowerCase())  // simplifying lowercase
}

export function wordifyDataSet(fileData: FileData): WordifiedDataset {
    const ds = Object.create(null as (object | null)) as WordifiedDataset; // Jetbrains built in typechecker is stupid
    for (const file in fileData) {
        const data = fileData[file]
        ds[file] = wordify(data)
    }
    return ds
}


export async function loadDataSet() {
    const fileData = Object.create(null as (object | null)) as FileData // Jetbrains built in typechecker is stupid
    const basicTextDir = './datasets/space/'
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

export function prep4search(dataset: WordifiedDataset): WordMap {
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
