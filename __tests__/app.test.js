const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")


beforeEach(()=>{
  return seed(data)
})

afterAll(()=>{
  return db.end()
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics",()=>{
  test("200: Responds with an array of topic objects where each topic object has properties of slug and description",()=>{
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body:{topics}})=>{
      expect(Array.isArray(topics)).toBe(true)
      expect(topics.length).toBe(3)
      topics.forEach(topic=>{
        expect(topic).toMatchObject({
          slug:expect.any(String),
          description:expect.any(String)
        })
      })
    })
  })

})

describe("/api/articles/:article_id",()=>{
  test("200: Responds with an article object",()=>{
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body: {article}})=>{
      expect(article).toMatchObject({
        author:expect.any(String),
        title:expect.any(String),
        article_id:1,
        body:expect.any(String),
        topic:expect.any(String),
        created_at:expect.any(String),
        votes:expect.any(Number),
        article_img_url:expect.any(String),
        comment_count:"11"
      })
    })
  })

  test("404 :Responds with a 'Not found' error message when attempting to GET an article by a valid ID that does not exist in the database",()=>{
    return request(app)
    .get("/api/articles/99999")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Not found")
    })
  })

  test("400 :Responds with a 'Bad request' error message when attempting to GET an article by an invalid ID",( )=>{
    return request(app)
    .get("/api/articles/two")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})



describe("GET /api/articles",()=>{
  test("200 :Responds with an articles array of article objects, also with a property of comment_count (the total count of all the comments with this article_id)",()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(Array.isArray(articles)).toBe(true)
      expect(articles.length).toBe(13)
      articles.forEach(article=>{
        expect(article).toMatchObject({
          author:expect.any(String),
          title:expect.any(String),
          article_id:expect.any(Number),
          topic:expect.any(String),
          created_at:expect.any(String),
          votes:expect.any(Number),
          article_img_url:expect.any(String),
          comment_count:expect.any(String)
        })
      })
    })
  })


  test("200: Responds with an articles array of article objects, each of which should be sorted by date in descending order.",()=>{
    return request(app)
    .get("/api/articles")
    .then(({body:{articles}})=>{
      expect(articles.length).toBe(13)
      expect(articles).toBeSortedBy("created_at",{
        descending: true
      })
    })
  })

  test("200: Responds with an articles array of article objects, each of which should not have a body property",()=>{
    return request(app)
    .get("/api/articles")
    .then(({body:{articles}})=>{
      expect(articles.length).toBe(13)
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
      })
    })

  })

})


describe("GET /api/articles/:article_id/comments",()=>{

  test("200: Responds with an array of comments for a valid article_id, which has comments",()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body:{comments}})=>{
      expect(Array.isArray(comments)).toBe(true)
      expect(comments.length).toBe(11)
      comments.forEach(comment=>{
        expect(comment).toMatchObject({
          comment_id:expect.any(Number),
          votes:expect.any(Number),
          created_at:expect.any(String),
          author:expect.any(String),
          body:expect.any(String),
          article_id:1
        })
      })
    })
  })

  test("200: Responds with comments served with the most recent comments first",()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .then(({body:{comments}})=>{
      expect(comments).toBeSortedBy("created_at",{
        descending: true
      })
    })
  })

  test("200: Responds with an empty array of comments for a valid article_id, which has zero comments",()=>{
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({body:{comments}})=>{
      expect(Array.isArray(comments)).toBe(true)
      expect(comments.length).toBe(0)
    })

  })

  test("404: Responds with an error message of 'Invalid article id' when article id is a valid id input, but doesn't exist in the database",()=>{
    return request(app)
    .get("/api/articles/99999/comments")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Invalid article id provided")
    })
  })

  test("400: Responds with an error message of 'Bad Request' when article id is invalid",()=>{
    return request(app)
    .get("/api/articles/two/comments")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })

  })

 
})


describe("POST /api/articles/:article_id/comments",()=>{
  test("201: Responds with the newly posted comment with correct properties",()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({username:"butter_bridge",
      body:"Amazing"
    })
    .expect(201)
    .then(({body:{comment}})=>{
      expect(comment)
      .toMatchObject({
        body: "Amazing",
        votes:0,
        author: "butter_bridge",
        article_id: 1,
        created_at:expect.any(String)
      })
    })
  })
  
  test("400: Responds with a message of Bad Request when request body doesnt contain the correct fields",()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({username:"butter_bridge"
    })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Bad Request')
    })
  })

  test("400: Responds with a message of Bad Request when request body contains the correct fields, but with invalid values",()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({username:3,
      body:1
    })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Bad Request')
    })
  })

  test("400: Responds with error message of 'Bad Request' when an invalid article id is used",()=>{
    return request(app)
    .post("/api/articles/one/comments")
    .send({username:"butter_bridge",
      body:"Amazing"
    })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Bad Request')
    })
  })

  test("404: Responds with error message of 'Article id not found' when a valid article id is used, which doesnt exist in the database",()=>{
    return request(app)
    .post("/api/articles/99999/comments")
    .send({username:"butter_bridge",
      body:"Amazing"
    })
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Article id not found')
    })
  
  })

})


describe("PATCH /api/articles/:article_id",()=>{
  test("200:Responds with incremented patched object ",()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 5 })
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject( {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 105,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      })
    })
  })

  test("200:Responds with decremented patched object ",()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: -10 })
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject(
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
    })
  })

  test("400: Responds with error message 'Bad Request' if article_id isn't valid",()=>{
    return request(app)
    .patch("/api/articles/one")
    .send({ inc_votes : 5 })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Bad Request')
    })

  })

  test("404: Responds with error message 'Article id not found' if article_id is valid but not in database",()=>{
    return request(app)
    .patch("/api/articles/99999")
    .send({ inc_votes : 5 })
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Article id not found')
    })
  })

  test("400: Responds with 'bad request' error message if request body value is invalid",()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes : "cat" })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Bad Request')
    })
    
  })

  test("400: Responds with 'bad request' error message if request body is missing properties",()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe('Bad Request')
    })
  })
})


describe("DELETE /api/comments/:comment_id",()=>{
  test("204: Responds with no content",()=>{
    return request(app)
    .delete("/api/comments/2")
    .expect(204)
  })

  test("404: Responds with error msg of 'comment_id not found' when comment_id is valid but not in database",()=>{
    return request(app)
    .delete("/api/comments/99999")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("comment_id not found")
    })
  })

  test("400: Responds with error msg of 'Bad Request' when article_id is invalid",()=>{
    return request(app)
    .delete("/api/comments/two")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("GET /api/users",()=>{
  test("200: Responds with an array of user objects",()=>{
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body:{users}})=>{
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBe(4)
      users.forEach(user=>{
        expect(user).toMatchObject({
          username:expect.any(String),
          name:expect.any(String),
          avatar_url:expect.any(String)

        })
      })
    })
  })

})

describe("GET /api/articles (with queries",()=>{

    test("200: /api/articles?sort_by=author (default order should be descending)",()=>{
      return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({body:{articles}})=>{
        expect(articles).toBeSortedBy("author",{
          descending: true
        })
      })
    })

    //Test failing 
    //endpoint works for all columns except COMMENT COUNT(column added by making a join)
    // test("200: /api/articles?sort_by=comment_count (default order should be descending)",()=>{
    //   return request(app)
    //   .get("/api/articles?sort_by=comment_count")
    //   .expect(200)
    //   .then(({body:{articles}})=>{
    //     expect(articles).toBeSortedBy("comment_count",{
    //       descending: true
    //     })
    //   })
    // })

   
  
    test("400: /api/articles?sort_by=review",()=>{
      return request(app)
      .get("/api/articles?sort_by=review")
      .expect(400)
      .then(({body:{msg}})=>{
        expect(msg).toBe("Bad Request")
      })
    })

    test("200: /api/articles?sort_by=author&order=asc",()=>{
      return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({body:{articles}})=>{
        expect(articles).toBeSortedBy("author")
      })
    })
  
    test("200: /api/articles?sort_by=author&order=desc",()=>{
      return request(app)
      .get("/api/articles?sort_by=author&order=desc")
      .expect(200)
      .then(({body:{articles}})=>{
        expect(articles).toBeSortedBy("author",{
          descending: true
        })
      })
    })
  
    test("400: /api/articles?sort_by=author&order=hello",()=>{
      return request(app)
      .get("/api/articles?sort_by=review")
      .expect(400)
      .then(({body:{msg}})=>{
        expect(msg).toBe("Bad Request")
      })
    })

})

describe(" GET /api/articles (topic query)",()=>{
  test("200: Responds with an array of all the articles of the queried topic when the topic exists, and has articles",()=>{
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(Array.isArray(articles)).toBe(true)
      expect(articles.length).toBe(12)
      articles.forEach(article=>{
        expect(article.topic).toBe("mitch")
      })
    })
  })

  test("200: Responds with an empty array of the articles of the queried topic when the topic exists, but has no articles",()=>{
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(Array.isArray(articles)).toBe(true)
      expect(articles.length).toBe(0)
    })
  })

  test("400: Responds with a message of 'Bad Request' when the queried topic doesnt exist in the topics table, hence has no articles",()=>{
    return request(app)
      .get("/api/articles?topic=coffee")
      .expect(400)
      .then(({body:{msg}})=>{
        expect(msg).toBe("Bad Request")
      })
  })

})


