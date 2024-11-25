exports.postgresErrorHandler = (err,req,res,next)=>{
    if(err.code){
        res.status(400).send({msg:"Bad Request"} )
    }
    next(err)
}

exports.customErrorHandler= (err,req,res,next)=>{
    const {status,msg} = err
    if(err && status){
        res.status(status).send({msg:msg} )
    }
    next(err)
}

exports.serverErrorHandler =(err,req,res,next)=>{
    res.status(500).send({ msg: "Internal Server Error" })

}

