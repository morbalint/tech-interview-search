import express from "express"

const app = express();

const omdbApiKey = process.env.OMDBAPIKEY

const sampleData = {data: [
        "foo",
        "bar",
        "Hello",
        "World",
        "!"
    ]}

app.get('/search', async (req, res) => {
    const searchTerm = (req.query as {q: string}).q as string

    res.setHeader('Access-Control-Allow-Origin', '*')

    const movies = fetch(`http://www.omdbapi.com/?t=${searchTerm}&apikey=${omdbApiKey}`)

    const movieResponse = await (await movies).json() as {Title: string | undefined}
    if (movieResponse.Title != null) {
        res.send({data: [`MOVIE: ${movieResponse.Title}`]})
    }
    else {
        res.send(sampleData)
    }
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
