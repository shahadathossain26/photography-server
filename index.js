const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

// console.log(process.env.PHOTOGRAPHY_DB_USER)
// console.log(process.env.PHOTOGRAPHY_DB_PASSWORD)

const uri = `mongodb+srv://${process.env.PHOTOGRAPHY_DB_USER}:${process.env.PHOTOGRAPHY_DB_PASSWORD}@cluster0.g42knj4.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('photography').collection('services');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
    }

    finally {

    }
}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Assainment 11 server is running')
})
app.listen(port, () => {
    console.log(`Assainment 11 server is running on port ${port}`);
})