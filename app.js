const express = require("express")
const app = express()
const {getApi,getApiTopics,getApiArticleById}= require("./controllers/api.controller")
const {customErrorHandler,serverErrorHandler,postgresErrorHandler}= require("./errors")

app.get("/api",getApi)

app.get("/api/topics",getApiTopics )

app.get("/api/articles/:article_id",getApiArticleById)

app.use(postgresErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app