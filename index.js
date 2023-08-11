const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ulnoerh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const serviceCollection = client.db('captureCraze').collection('services');
        const reviewCollection = client.db('captureCraze').collection('reviews');

        //endpoint
        app.post('/services', async (req, res) => {
            try {
                const result = await serviceCollection.insertOne(req.body);
                console.log("result from 33", result);
                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: "Successfully added your service"
                    });
                } else {
                    res.send({
                        success: false,
                        error: "Couldn't add the product"
                    });
                };
            }
            catch (error) {
                console.log(error.name, error.message)
                res.send({
                    success: true,
                    error: error.message,
                });
            }
        });

        app.get('/allservices', async (req, res) => {
            try {
                const query = {};
                const cursor = serviceCollection.find(query);
                const allServices = await cursor.toArray();

                res.send({
                    success: true,
                    message: "Successfully got the data",
                    data: allServices,
                })
            }
            catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

        app.get('/services', async (req, res) => {
            try {
                const query = {};
                const cursor = serviceCollection.find(query);
                const services = await cursor.limit(3).toArray();

                res.send({
                    success: true,
                    message: "Successfully got the data",
                    data: services,
                });
            }
            catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

        app.get('/service/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const serviceDetails = await serviceCollection.findOne(query);
                console.log(serviceDetails);
                res.send({
                    success: true,
                    message: "Successfully got the data",
                    data: serviceDetails,
                })
            }
            catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }

        })

    }
    finally {
        console.log("Operation is done.")
    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('capture craze server is running');
})

app.listen(port, () => {
    console.log(`Capture Craze Server is running on port ${port}`);
})