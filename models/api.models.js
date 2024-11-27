const { use } = require("../app")
const db = require("../db/connection")

exports.selectApiTopics = ()=>{
    return db.query(`SELECT * FROM topics`)
    .then(({rows})=>{
        return rows
    })
}

exports.selectApiArticleByID=(article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
    .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status:404,msg:"Not found"})
        }   
        return rows[0]
    })
}

exports.selectApiArticles = (sort_by, order) => {
  
    let queryString = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, 
        articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id`;

    const queryValues = [];

   
    const validSortBy = ["title", "topic", "author","created_at", "votes", "article_image_url", "article_id,comment_count"];
    
    
    if (sort_by && !validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg:"Bad Request" });
    }


    if (sort_by) {
        queryString += ` ORDER BY ${sort_by}`;
      
    }

    const validOrder = ["asc", "desc"];
    if (order && !validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad Request: Invalid order value" });
    }

    if (order) {
        queryString += ` ${order}`
        
    }

    return db.query(queryString, queryValues)
        .then(({ rows }) => {
            console.log(rows);
            return rows;
        });
};



exports.checkApiArticleExists=(article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status:404,msg:"Invalid article id provided"})
        }
       
    })

}

exports.selectApiArticleComments=(article_id)=>{
    return db.query('SELECT comment_id,votes,created_at,author,body,article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC',[article_id])
    .then(({rows})=>{
      return rows
    })
}


exports.insertArticleComment = (commentToPost, article_id) => {
    const { username, body } = commentToPost;

    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {

          return Promise.reject({ status: 404, msg: "Article id not found" });
        }
  
        return db.query(
          `INSERT INTO comments (body, votes, author, article_id, created_at)
           VALUES ($1, 0, $2, $3, NOW())
           RETURNING *`,
          [body, username, article_id]
        );
      })
      .then(({ rows }) =>{
        return rows[0]
      } ); 
  };

exports.updateApiArticle=(article_id,inc_votes)=>{
return db.query(`UPDATE articles SET votes=votes+$1 WHERE article_id = $2 RETURNING *`,[inc_votes,article_id])
.then(({rows})=>{
    if(rows.length===0){
        return Promise.reject({status:404,msg:"Article id not found"})
    }
return rows[0]
})
}

exports.deleteDbApiComment=(comment_id)=>{
    return db.query(`DELETE from comments WHERE comment_id=$1 RETURNING *`,[comment_id])
    .then(({rows})=>{
        if(rows.length ===0){
            return Promise.reject({status:404,msg:"comment_id not found"})
        }
        return rows[0]
    })
}

exports.selectApiUsers=()=>{
    return db.query(`SELECT * FROM users`)
    .then(({rows})=>{
        return rows
    })
}