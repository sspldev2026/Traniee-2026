const express = require("express")
const mongoose = require("mongoose")
const app = express()
const category = require("./models/categoryModel.js")
const Product = require("./models/productModel.js")
const Orders = require("./models/orderModel.js")
const bodyParser = require('body-parser');
const cors = require('cors');

const productRouter = require("./router/productRouter.js")

app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions))




try {
    mongoose.connect('mongodb://127.0.0.1:27017/product').then(() => {
        console.log("DB connected")
    });

} catch (error) {
    handleError(error);
}



app.use("/product",productRouter)



app.get("/category", async (req, res) => {
    const hi = await category.find()
    res.send(hi)
})

app.get("/products", async (req, res) => {
    const hi = await Product.find().populate("category")
    console.log(hi)
    res.send(hi[0])
})

app.get("/bulkProduct", async (req, res) => {
    products = [
  {
    "name": "Men's Cotton T-Shirt",
    "description": "Comfortable round neck cotton t-shirt made from 100% cotton.",
    "price": 799,
    "stock": 50,
    "image": "https://picsum.photos/seed/tshirt/600/600",
    "category": "6a47b4391a877b1b25d0d500"
  },
  {
    "name": "Women's Denim Jacket",
    "description": "Classic blue denim jacket with regular fit.",
    "price": 2499,
    "stock": 20,
    "image": "https://picsum.photos/seed/denim/600/600",
    "category": "6a47b4391a877b1b25d0d500"
  },
  {
    "name": "Men's Formal Shirt",
    "description": "Slim fit formal shirt for office and business wear.",
    "price": 1499,
    "stock": 35,
    "image": "https://picsum.photos/seed/formalshirt/600/600",
    "category": "6a47b4391a877b1b25d0d500"
  },
  {
    "name": "Nike Air Max Shoes",
    "description": "Lightweight running shoes with superior cushioning.",
    "price": 5999,
    "stock": 25,
    "image": "https://picsum.photos/seed/nike/600/600",
    "category": "6a47b49d7190d3400933bd60"
  },
  {
    "name": "Adidas Slides",
    "description": "Comfortable slides for everyday casual wear.",
    "price": 1499,
    "stock": 40,
    "image": "https://picsum.photos/seed/slides/600/600",
    "category": "6a47b49d7190d3400933bd60"
  },
  {
    "name": "Puma Sports Shoes",
    "description": "Breathable sports shoes for gym and running.",
    "price": 4499,
    "stock": 30,
    "image": "https://picsum.photos/seed/puma/600/600",
    "category": "6a47b49d7190d3400933bd60"
  },
  {
    "name": "iPhone 15",
    "description": "Apple iPhone 15 with A16 Bionic chip and Super Retina display.",
    "price": 79999,
    "stock": 15,
    "image": "https://picsum.photos/seed/iphone15/600/600",
    "category": "6a47b4c2ea147cff890a8685"
  },
  {
    "name": "Samsung Galaxy S24",
    "description": "Flagship Android smartphone with AMOLED display.",
    "price": 74999,
    "stock": 18,
    "image": "https://picsum.photos/seed/galaxys24/600/600",
    "category": "6a47b4c2ea147cff890a8685"
  },
  {
    "name": "Boat Rockerz 450",
    "description": "Wireless Bluetooth headphones with deep bass.",
    "price": 1999,
    "stock": 60,
    "image": "https://picsum.photos/seed/boat/600/600",
    "category": "6a47b4c2ea147cff890a8685"
  },
  {
    "name": "Apple AirPods Pro",
    "description": "Premium wireless earbuds with Active Noise Cancellation.",
    "price": 24999,
    "stock": 12,
    "image": "https://picsum.photos/seed/airpods/600/600",
    "category": "6a47b4c2ea147cff890a8685"
  },
  {
    "name": "Anker 20000mAh Power Bank",
    "description": "Fast charging USB-C power bank with 20000mAh capacity.",
    "price": 3499,
    "stock": 45,
    "image": "https://picsum.photos/seed/powerbank/600/600",
    "category": "6a47b4c2ea147cff890a8685"
  }
]
    const hi = await Product.insertMany(products)
    console.log(hi)
    res.send(hi)
})

app.post("/order", async (req, res) => {
    console.log(req.body)
    const { customerName, items, totalAmount, paymentMethod, status } = req.body
    const hi = await Orders.create({
        customerName, items, totalAmount, paymentMethod, status
    })
    res.send(hi)
})
app.get("/orders", async (req, res) => {
    const hi = await Orders.find().populate({
        path: 'items',
        populate: {
            path: 'productId'
        }
    })
    res.send(hi)
})






app.listen(8000, () => console.log("Server running on port 8000"))