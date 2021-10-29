const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5500;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yatx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

  try {

    await client.connect();

    const database = client.db("carMechanic");
    const serviceCollection = database.collection("services")

    // GET API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services)
    })

    //GET SINGLE API
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service)
    })

    //POST API
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result)
    })

    //DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query)
      res.json(result)
    })

  }
  finally {

  }

}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Genius car machanics server')
})

app.get('/hellow', (req, res) => {
  res.send('hellow')
})


app.listen(port, () => {
  console.log('Ginius car mac- server run on the port', port)
})
