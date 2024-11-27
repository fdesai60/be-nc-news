const endpointsJson = require("../endpoints.json")
const {selectApiTopics, selectApiArticleByID,selectApiArticles, checkApiArticleExists,selectApiArticleComments,insertArticleComment,
updateApiArticle,

}=require("../models/api.models")

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
        console.log(article);
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

exports.postArticleComment =(req,res,next)=>{
    const commentToPost=req.body
    const{article_id}=req.params
    insertArticleComment(commentToPost,article_id)
    .then(comment=>{
        console.log(comment);
        res.status(201).send({comment})
    })
    .catch(err=>{
        next(err)
    })
    
}

exports.patchApiArticle=(req,res,next)=>{
    const {article_id}=req.params
    const { inc_votes} = req.body
    updateApiArticle(article_id,inc_votes)
    .then(article=>{
        res.status(200).send({article})
    })
    .catch(err=>{
        next(err)
    })
    
    
}

