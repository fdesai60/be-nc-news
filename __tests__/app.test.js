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
        author:expect.any(String),
        title:expect.any(String),
        article_id:expect.any(Number),
        body:expect.any(String),
        topic:expect.any(String),
        created_at:expect.any(String),
        votes:expect.any(Number),
        article_img_url:expect.any(String),
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