const db = require("../data/config");
const server = require("./server");
const request = require("supertest");

// Request to root "/" - response on site should be "Welcome to Our Server (Geograpics)"
describe("GET", () => {
  it("GET server.js", () => {
    return request(server)
      .get("/")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});

describe("User CRUD", () => {
  it("GET list of users", () => {
    return request(server)
      .get("/users")
      .expect(200)
  })
  it("POST new User", () => {
    return request(server)
      .post("/users")
      .send({access_token: "TestUser",
      private: true,
      insta_id: 55555,
      username: "Test",
      profile_pic: "",
      full_name: "Test",
      bio: "",
      website: "",
      is_business: false})
      .expect(200)
  })
});