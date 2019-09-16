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
      .expect(200)
  })

  // it("POST new User", async () => {
  //   return await request(server)
  //     .post("/users")
  //     .send({
  //       insta_id: 123456,
  //       access_token: "TestUserToken",
  //       private: true,
  //       username: "TestUsername",
  //       full_name: "Test Fullname"
  //     })
  //     .expect(200)
  // })
})
