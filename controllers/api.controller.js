const endpointsJson = require("../endpoints.json")
const {selectApiTopics}=require("../models/api.models")

exports.getApi = (req,res)=>{
    res.status(200).send({endpoints:endpointsJson})
}

exports.getApiTopics =(req,res)=>{
    selectApiTopics()
    .then(topics=>{
        res.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}