const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4gdc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('laptopGallery');
        const usersCullection = database.collection('users');
        const orderCullection = database.collection('orders');
        const laptopCullection = database.collection('laptops');

        console.log('Database connected');

        //USER SAVE START WHEN COME REGI

        app.post('/users', async(req, res) =>{
            const user = req.body;
            console.log(user);
            const result = await usersCullection.insertOne(user);
            res.json(result);
        });
        
        //USER SAVE END
        //USER SAVE START WHEN LOGIN GOGLE   

        app.put('/users', async(req, res) =>{
            const user = req.body;
            console.log(user);
            const filter = {email: user.email};
            const options = { upsert: true };
            const updateDoc = {$set: user};
            const result = await usersCullection.insertOne(filter, updateDoc, options);
            res.json(result);
        });

        //USER SAVE END
        //PRODUCT START

        //ADD PRODUCT
        app.post('/laptops', async(req, res) => {
            const laptop = req.body;
            const result = await laptopCullection.insertOne(laptop);
            console.log(result);
            res.send(result);
        });

        //GET ALL PRODUCT
        app.get('/laptops', async(req, res) => {
            const cursor = laptopCullection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });
    
        //GET SINGLE PRODUCT BY ID
        app.get('/laptops/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const products = await laptopCullection.findOne(query);
            res.json(products);
        });


        //PRODUCT END
        //ORDER START


        //ADD ORDER
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCullection.insertOne(order);
            console.log(result);
            res.send(result);
        });

        //GET ALL ORDERS
        app.get('/orders', async(req, res) => {
            const cursor = orderCullection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });

        //GET SINGLE ORDER
        app.get('/orders', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = orderCullection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });

        //DELETE SINGLE ORDER BY ID
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const order = await orderCullection.deleteOne(query);
            res.json(1);
        });






    }
    finally{
        // await client.close() 
    }

}
run().catch(console.dir);


// Check for Local host link
app.get('/', (req, res) => {
    res.send('Message From Srever');
});

// Check for running Server Port
app.listen(port, (req, res) => {
    console.log('Server is connected laptops', port);
});
