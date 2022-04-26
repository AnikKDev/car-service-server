const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


// middleware
app.use(cors());
app.use(express.json());

//
app.get('/', (req, res) => {
    res.send('Server is runnig')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xe2be.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// 1. first remove this
/* client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('Car db connected')
    // perform actions on the collection object
    client.close();
}); */

// 2. create a run function
async function run() {
    // 3. add try and funally
    try {
        // 4. wait for connection with client server
        await client.connect();
        // 5.create collection variable and search db from client and then search collection in it
        // 5.1. name should be same as browse collection name in mongo db server.
        const serviceCollection = client.db('carService').collection('service');
        // create an api. so that we can return data after getting a request call and then it will respond
        app.get('/service', async (req, res) => {
            // 6. create empty query for get the datas from db
            const query = {};
            // 7. create a cursor to find some data from serviceCollection ....as we want to find many data
            const cursor = serviceCollection.find(query);
            // 8. create services, what it will do is it will convert the data to an array which the cursor has found
            const services = await cursor.toArray();
            // 9. after converting it to array send the data
            res.send(services);
        })


        // now create an id for get a single service or element or data
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            // 1. create query with parameter id and pass id in ObjectId which will comefrom mongodb
            const query = { _id: ObjectId(id) };
            // ***as this is not for multiple data so we don't have to add cursor
            // 2. find one data from service collection that had been already provided.we aalready provided the id in query variable
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })



        // to add data from client side to server side add post
        app.post('/service', async (req, res) => {
            // 1. get the data from request body
            const newService = req.body;
            // 2. insert one data to serviceCollection and the data will be come from client side and put it to result variable
            const result = await serviceCollection.insertOne(newService);
            // 3. send the result as a response
            res.send(result)

        })

    }
    finally {

    }
};
// call the function
run().catch(console.dir);

app.listen(port, () => {
    console.log('listening to port', port);
})