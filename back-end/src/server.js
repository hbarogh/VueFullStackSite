//entry point for the server for the backend code 
import express from 'express';
import {MongoClient} from 'mongodb';


async function start(){
  const url = `mongodb+srv://fsv-server:_2mrsGW2xJp!JuF@cluster0.weuhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db('fsv-db');
  
  const app = express();
  app.use(express.json());
  
  
  app.get('/products', async (req,res) => {
    const products = await db.collection('products').find({}).toArray();
    res.send(products);
  });
  
  async function populateCardIds(ids) {
    return Promise.all(ids.map(id => db.collection('products').findOne({id})));
  }
  
  app.get('/users/:userId/cart', async (req,res) => {
    const user = await db.collection('users').findOne({id: req.params.userId});
    const populatedCart = await populateCardIds(user.cartItems);
    res.json(populatedCart);
  });
  
  app.get('/products/:productId', async (req,res) => {
    const productId = req.params.productId;
    const product = await db.collection('products').findOne({id: productId});
    res.json(product);
  });
  
  app.post('/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;
    await db.collection('users').updateOne({id: userId}, { //this is an example of an update query 
      $addToSet: {cartItems: productId} //want to push productId onto the user's cartItems property 
    });
    const user = await db.collection('users').findOne({id: req.params.userId});
    const populatedCart = await populateCardIds(user.cartItems);
    res.json(populatedCart);
  });
  
  app.delete('/users/:userId/cart/:productId', async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection('users').updateOne( {id: userId},{
      $pull: {cartItems: productId} //we are removing an item from the user's cart here
    });
    const user = await db.collection('users').findOne({id: req.params.userId});
    const populatedCart = await populateCardIds(user.cartItems);
    res.json(populatedCart);
  });
  
  app.listen(8000, () => {
    console.log('Server is listening on port 8000')
  });
}

start();