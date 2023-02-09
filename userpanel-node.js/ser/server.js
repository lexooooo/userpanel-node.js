require("dotenv").config()
const http = require("http")
const express = require("express")
const app = express()
const port = process.env.PORT
const mongoUri = process.env.MONGO_URI
const cors = require("cors")
const path = require("path")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const router = require("./modules/router.js")
const routerImg = require('./functions/multer.js')
const DB = require("mongodb")
const mongoose = require("mongoose")
const server = http.createServer(app)

mongoose.set('strictQuery', true)
//app.use(morgan())
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/register', router)
app.use('/imageupload', routerImg)

app.get('/', (req, res) => {
 res.send("SERVER IS HERE")
})



server.listen(port || 3001, () => {
 console.log("server connected")
})
.on("listening", () => {
 mongoose.connect(mongoUri, () => {
  console.log("data base connected")
 })
})