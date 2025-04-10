//entry point for the server for the backend code 
import express from 'express';
import {MongoClient} from 'mongodb';
import path from 'path';

async function start(){
  const url = `mongodb+srv://fsv-server:_2mrsGW2xJp!JuF@cluster0.weuhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db('fsv-db');
  
  const app = express();
  app.use(express.json());
  
  app.use('/images', express.static(path.join(__dirname, '../assets')));
  
  app.use(express.static(
    path.resolve(__dirname, '../dist'),
    { maxAge: '1y', etag: false},
  ));

  app.get('/api/products', async (req,res) => {
    const products = await db.collection('products').find({}).toArray();
    res.send(products);
  });
  
  async function populateCardIds(ids) {
    return Promise.all(ids.map(id => db.collection('products').findOne({id})));
  }
  
  app.get('/api/users/:userId/cart', async (req,res) => {
    const user = await db.collection('users').findOne({id: req.params.userId});
    const populatedCart = await populateCardIds(user?.cartItems || []);
    res.json(populatedCart);
  });
  
  app.get('/api/products/:productId', async (req,res) => {
    const productId = req.params.productId;
    const product = await db.collection('products').findOne({id: productId});
    res.json(product);
  });
  
  app.post('/api/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    const existingUser = await db.collection('users').findOne( {id: userId});
    if (!existingUser){ //if there isn't a current user then we will create a new user and initialize their cart to an empty array
      await db.collection('users').insertOne({id: userId, cartItems: []});
    }

    await db.collection('users').updateOne({id: userId}, { //this is an example of an update query 
      $addToSet: {cartItems: productId} //want to push productId onto the user's cartItems property 
    });
    const user = await db.collection('users').findOne({id: req.params.userId});
    const populatedCart = await populateCardIds(user?.cartItems || []);
    res.json(populatedCart);
  });
  
  app.delete('/api/users/:userId/cart/:productId', async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection('users').updateOne( {id: userId},{
      $pull: {cartItems: productId} //we are removing an item from the user's cart here
    });
    const user = await db.collection('users').findOne({id: req.params.userId});
    const populatedCart = await populateCardIds(user?.cartItems || []);
    res.json(populatedCart);
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html')); //this will send back the html file for every request that isn't handled by an api endpoint
  })

  const port = process.env.PORT || 8000; 

  app.listen(port, () => {
    console.log('Server is listening on port: ' + port);
  });
}

start();