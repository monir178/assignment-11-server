const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const serviceCollection = client.db('captureCraze').collection('services');
        const reviewCollection = client.db('captureCraze').collection('reviews');

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
            res.send({ token })

        })

        //for adding review
        app.post('/reviews', verifyJWT, async (req, res) => {
            try {
                const result = await reviewCollection.insertOne(req.body);
                console.log(result);
                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: "Successfully added your review",

                    });
                }
                else {
                    res.send({
                        success: false,
                        error: "Couldn't add your review"
                    });
                }

            }
            catch (error) {
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

        //for adding service
        app.post('/services', verifyJWT, async (req, res) => {
            try {
                const result = await serviceCollection.insertOne(req.body);
                // console.log("result from 33", result);
                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: "Successfully added your service",

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
                    success: false,
                    error: error.message,
                });
            }
        });

        //getting reviews
        app.get('/reviews/:id', async (req, res) => {
            try {
                const id = req.params.id;
                console.log(id);
                const query = { service_id: id }
                const singleReview = await reviewCollection.find(query).toArray();
                console.log(singleReview);
                res.send({
                    success: true,
                    message: "Successfully got the data",
                    data: singleReview,
                })
            }
            catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });

        // Edit review 
        app.patch('/reviews/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            try {
                const result = await reviewCollection.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
                if (result.matchedCount) {
                    res.send({
                        success: true,
                        message: `Updated successfully`,
                    });
                } else {
                    res.send({
                        success: false,
                        error: "Couldn't update the review",
                    });
                }
            } catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });

        //delete review
        app.delete('/reviews/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            try {
                const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount) {
                    res.send({
                        success: true,
                        message: 'Review deleted successfully',
                    });
                } else {
                    res.send({
                        success: false,
                        error: "Couldn't delete the review",
                    });
                }
            } catch (error) {
                console.error(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });



        //get reviews by email
        app.get('/reviews', verifyJWT, async (req, res) => {
            // console.log(req.headers.authorization);
            const decoded = req.decoded;

            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'forbidden' })
            }
            try {
                let query = {};

                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }
                const cursor = reviewCollection.find(query);
                const reviewByEmail = await cursor.toArray();
                res.send({
                    success: true,
                    message: "successfully got the data",
                    data: reviewByEmail
                })

                console.log(req.query.email);
            }
            catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                })
            }
        })



        //get all services from mongodb
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