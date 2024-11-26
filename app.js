const express = require("express")
const app = express()
const {getApi,getApiTopics,getApiArticleById, getApiArticles, getApiArticleComments}= require("./controllers/api.controller")
const {customErrorHandler,serverErrorHandler,postgresErrorHandler}= require("./errors")

app.get("/api",getApi)

app.get("/api/topics",getApiTopics )

app.get("/api/articles/:article_id",getApiArticleById)

app.get("/api/articles",getApiArticles)

app.get("/api/articles/:article_id/comments",getApiArticleComments )

app.use(postgresErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app