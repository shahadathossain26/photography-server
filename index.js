const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewsCollection = client.db('photography').collection('reviews');


        app.get('/', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const latestWork = await cursor.limit(3).toArray();
            res.send(latestWork);
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.get('/reviews', async (req, res) => {
            console.log(req.query)
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            let query = { service_id: id }
            const cursor = reviewsCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);

        })

        //MyReview api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
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