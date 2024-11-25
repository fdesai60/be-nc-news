const endpointsJson = require("../endpoints.json")
const {selectApiTopics, selectApiArticleByID,selectApiArticles}=require("../models/api.models")

exports.getApi = (req,res)=>{
    res.status(200).send({endpoints:endpointsJson})
}

exports.getApiTopics =(req,res,next)=>{
    selectApiTopics()
    .then(topics=>{
        res.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getApiArticleById =(req,res,next)=>{
    const {article_id} = req.params
    selectApiArticleByID(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch(err=>{
        next(err)
    })
   
}

exports.getApiArticles=(req,res,next)=>{
    selectApiArticles() 
    .then(articles=>{
        res.status(200).send({articles})
    })
    .then(err=>{
        next(err)
    })

}