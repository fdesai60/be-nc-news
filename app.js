const express = require("express")
const app = express()
const {getApi,getApiTopics,getApiArticleById, getApiArticles, getApiArticleComments,postArticleComment,
patchApiArticle,

 }= require("./controllers/api.controller")

const {customErrorHandler,serverErrorHandler,postgresErrorHandler}= require("./errors")

app.use(express.json())

app.get("/api",getApi)

app.get("/api/topics",getApiTopics )

app.get("/api/articles/:article_id",getApiArticleById)

app.get("/api/articles",getApiArticles)

app.get("/api/articles/:article_id/comments",getApiArticleComments )

app.post("/api/articles/:article_id/comments",postArticleComment )

app.patch("/api/articles/:article_id",patchApiArticle)


app.use(postgresErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app