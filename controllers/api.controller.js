const endpointsJson = require("../endpoints.json")
const {selectApiTopics, selectApiArticleByID,selectApiArticles, checkApiArticleExists,selectApiArticleComments,insertArticleComment,
updateApiArticle,
deleteDbApiComment,
selectApiUsers
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
        res.status(200).send({article})
    })
    .catch(err=>{
        next(err)
    })
   
}

exports.getApiArticles=(req,res,next)=>{
    const {sort_by="created_at",order="desc"}=req.query 
    selectApiArticles(sort_by,order) 
    .then(articles=>{   
        res.status(200).send({articles})
    })
    .catch(err=>{
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

exports.deleteApiComment=(req,res,next)=>{
    const {comment_id}=req.params
    
    deleteDbApiComment(comment_id)
    .then(()=>{
        res.send(204)
    })
    .catch(err=>{
        next(err)
    })

}

exports.getApiUsers=(req,res,next)=>{
    selectApiUsers()
    .then(users=>{
        res.status(200).send({users})
    })
    .then(err=>{
        next(err)
    })
}