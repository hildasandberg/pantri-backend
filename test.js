import mongoose from “mongoose”
import express from “express”
import cors from “cors”
import bodyParser from “body-parser”

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(“mongodb://localhost/technigo-forum-2”, { useMongoClient: true })

mongoose.Promise = Promise

mongoose.connection.once(“open”, () => {
 console.log(“Connected to mongodb”)
})

mongoose.connection.on(“error”, err => {
 console.error(“connection error:“, err)
})

const Topic = mongoose.model(“Topic”, {
 //attributes for questions here.
 name: String,
 email: String,
 headline: String,
 content: String,
 category: String,
 date: Date,
 isAnswered: Boolean,
 isVisible: Boolean
})

const Comment = mongoose.model(“Comment”, {
 name: String,
 email: String,
 content: String,
 date: Date,
 isAdmin: Boolean,
 isVisible: Boolean,
 inReplyTo: { type: mongoose.Schema.Types.ObjectId, ref: “Topic” }
})

app.get(“/faq”, (req, res) => {
 Topic.find().then( faq => res.json(faq))
})

app.post(“/faq”, (req, res) => {
 const faq = new Topic(req.body)

 faq.save()
   .then(() => { res.status(201).send(“Topic created”)})
   .catch(err => { res.status(400).send(err)})
})

app.get(“/topics/:topicId/comments”, (req, res) => {
 Comment.find({inReplyTo:req.params.topicId}).then( faq => res.json(faq))
})

app.post(“/comments”, (req, res) => {
 const comment = new Comment(req.body)

 comment.save()
 .then(() => { res.status(201).send(“New comment created”)})
 .catch(err => { res.status(400).send(err)})
})

app.listen(8080, () => {
 console.log(“Server running on port 8080")
})
// path parameters
// {
//   “name”: “Bjorn Johnson”,
//   “email”: “bjossijohnson@email.com”,
//   “headline”: “Whats wrong”,
//   “content”: “Team Technigo”,
//   “category”: “Basic”,
//   “date”: {date},
//   “isAnswered”: false,
//   “isVisible”: false
// }
