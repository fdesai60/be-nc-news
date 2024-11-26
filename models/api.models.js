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

exports.selectApiArticles= ()=>{
    return db.query(`
SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,COUNT(comment_id) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles. article_id
ORDER BY articles.created_at DESC;
`)
    .then(({rows})=>{
    
        return rows
    })
}


exports.checkApiArticleExists=(article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status:404,msg:"Invalid article id provided"})
        }
        // console.log(rows[0]);
    })

}

exports.selectApiArticleComments=(article_id)=>{
    return db.query('SELECT comment_id,votes,created_at,author,body,article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC',[article_id])
    .then(({rows})=>{
      return rows
    })
}


exports.postArticleComment = (commentToPost, article_id) => {
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
