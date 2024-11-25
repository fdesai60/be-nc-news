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
  test("200: Responds with an article object, which should have the following properties:author,title,article_id,body,topic,created_at,votes and article_img_url",()=>{
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({body: {article}})=>{
      expect(article).toMatchObject({
        author:"icellusedkars",
        title:"Sony Vaio; or, The Laptop",
        article_id:2,
        body:"Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        topic:"mitch",
        created_at:expect.any(String),
        votes:expect.any(Number),
        article_img_url:"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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
  test("200 :Responds with an articles array of article objects, each of which should have the following properties: author,title,article_id,topic,created_at,votes,article_img_url and comment_count (the total count of all the comments with this article_id)",()=>{
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