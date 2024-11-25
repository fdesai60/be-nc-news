const db = require("../db/connection")

exports.selectApiTopics = ()=>{
    return db.query(`SELECT * FROM topics`)
    .then(({rows})=>{
        return rows
    })
}