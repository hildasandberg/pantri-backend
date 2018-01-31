import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
// import uuid from "uuid/v4"
// import bcrypt from "bcrypt-nodejs"

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongoLecture"
mongoose.connect(mongoUrl, { useMongoClient: true })

// Used when run on local storage
// mongoose.connect("mongodb://localhost/shopper", { useMongoClient: true })

mongoose.Promise = Promise
mongoose.connection.on("error", err => console.error("Connection error:", err))
mongoose.connection.once("open", () => console.log("Connected to mongodb"))

// Defines the models for the database
const Item = mongoose.model("Item", {
  name: String,
  category: String,
  amount: String,
  unit: String,
  got: Boolean,
  buy: Boolean
})

const Category = mongoose.model("Category", {
  name: String,
  icon: String
})

// Endpoint for posting a category
app.post("/categories", (req, res) => {
  const category = new Category(req.body)
  category.save()
    .then(() => { res.status(201).send({ answer: "Category added" }) })
    .catch(err => { res.status(400).send(err) })
})

// Endpoint for posting an item
app.post("/items", (req, res) => {
  const item = new Item(req.body)
  item.save()
    .then(() => { res.status(201).send({ answer: "Item added" }) })
    .catch(err => { res.status(400).send(err) })
})

// Endpoint for put an item (update an item)
app.put("/items/:id", (req, res) => {
  const condition = { _id: req.params.id }
  console.log(condition, req.body)
  Item.update(condition, req.body)
    .then(() => { res.status(201).send({ answer: "item updated in Mongodb" }) })
    .catch(err => { res.status(400).send(err) })
})

// Endpoint for getting all categories
app.get("/categories", (req, res) => {
  Category.find().then(allCategories => {
    res.json(allCategories)
  })
})

// Endpoint for getting an item based on id
app.get("/items/:id", (req, res) => {
  const id = req.params.id
  Item.find({ _id: id }).then(foundItem => {
    console.log(foundItem)
    if (foundItem) {
      res.send(foundItem)
    } else {
      res.status(404)
    }
  })
})

// Endpoint for getting all items
app.get("/items", (req, res) => {
  Item.find().then(allItems => {
    res.json(allItems)
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
