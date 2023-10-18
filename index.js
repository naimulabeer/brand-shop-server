const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygqixms.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const productCollection = client.db("productDB").collection("product");
    const categoryCollection = client.db("productDB").collection("category");

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/product/:brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          image: updatedProduct.image,
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // const categories = [
    //   {
    //     brandName: "Nike",
    //     brandImage: "https://i.ibb.co/XyTTGRR/category1.jpg",
    //   },
    //   {
    //     brandName: "Adidas",
    //     brandImage: "https://i.ibb.co/BjQDWyd/category2.png",
    //   },
    //   {
    //     brandName: "Puma",
    //     brandImage: "https://i.ibb.co/rm6B9ZD/category3.jpg",
    //   },
    //   {
    //     brandName: "New Balance",
    //     brandImage: "https://i.ibb.co/FqZPdWK/category4.png",
    //   },
    //   {
    //     brandName: "Reebok",
    //     brandImage: "https://i.ibb.co/wQJmqQw/category5.png",
    //   },
    //   {
    //     brandName: "Versace",
    //     brandImage: "https://i.ibb.co/fFzyYTw/category6.png",
    //   },
    // ];

    // await categoryCollection.insertMany(categories);

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brand Shop server is running");
});

app.listen(port, () => {
  console.log(`Brand Shop Server is running on port: ${port}`);
});
