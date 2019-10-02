const db = require("../data/config")
const server = require("./server");
const request = require("supertest");

// Request to root "/" - response on site should be "Welcome to Our Server (Geograpics)"
describe("GET root", () => {
  it("GET server.js", () => {
    return request(server)
      .get("/")
      .then(res => {
        expect(res.status).toBe(200)
      })
  })
})

describe("Picture CRUD tests", () => {
  it("GET list of pictures without authorization", async () => {
    return await request(server)
      .get("/map")
      .expect(401);
  });

  it("Update existing user with improper token", async () => {
    return await request(server)
      .get("/map/update")
      .send({
        authorization: "abc123"
      })
      .expect(401);
  });


  it("Resync picture table without proper token", async () => {
    return request(server)
      .put(`/map/refresh`)
      .send({
        authorization: "abc123"
      })
      .expect(401);
  })
})