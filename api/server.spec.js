const db = require("../data/config")
const server = require("./server");
const request = require("supertest");

// Request to root "/" - response on site should be "Welcome to Our Server (Geograpics)"
describe("GET root", () => {
  it("GET server.js", () => {
    return request(server)
      .get("/")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});

describe("User CRUD tests", () => {
  it("GET list of users", async () => {
    return await request(server)
      .get("/users")
      .expect(200);
  });

  it("POST new User", async () => {
    return await request(server)
      .post("/users")
      .send({
        insta_id: 1,
        access_token: "TestUserToken",
        private: true,
        username: "TestUsername",
        full_name: "Test Fullname"
      })
      .expect(200);
  });
  // PUT and DELETE working credited to Dustin Hamano
  //  His code for a db query + array length was what finally allowed Supertest to delete
  // the the test data
  it("PUT user", async () => {
    let arr = await db("users");
    let id = arr[arr.length - 1].id;
    return request(server)
      .put(`/users/${id}`)
      .send({
        insta_id: 2,
        access_token: "TestUserTokenEdited",
        private: true,
        username: "TestUsernameEdited",
        full_name: "Test FullnameEdited"
      })
      .expect(200);
  })
  it("DELETE user", async () => {
    let arr = await db("users");
    let id = arr[arr.length - 1].id;
    return request(server)
      .delete(`/users/${id}`)
      .expect(201);
  })
})