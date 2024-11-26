const endpointsJson = require("../endpoints.json")
const {selectApiTopics, selectApiArticleByID,selectApiArticles, checkApiArticleExists,selectApiArticleComments}=require("../models/api.models")

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

exports.getApiArticleComments =(req,res,next)=>{
    const{article_id}=req.params
    checkApiArticleExists(article_id)
    .then(()=>{
        return selectApiArticleComments(article_id)
    })
    .then((comments) => {
        console.log(comments[0]);
        res.status(200).send({ comments });
      })
    .catch(err=>{
        next(err)
    })
    
}