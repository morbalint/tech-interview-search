import express from "express"

const app = express();

const sampleData = {data: [
        "foo",
        "bar",
        "Hello",
        "World",
        "!"
    ]}

app.get('/search', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(sampleData)
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
