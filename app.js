const express = require("express")
const app = express()
const {getApi,getApiTopics}= require("./controllers/api.controller")

app.get("/api",getApi)

app.get("/api/topics",getApiTopics )

app.use((err,req,res,next)=>{
    res.status(500).send({ msg: "Internal Server Error" })
})

module.exports = app