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
  })

  it("POST new User + PUT User", async () => {
    return await request(server)
      .post("/users")
      .send({
        insta_id: 1,
        access_token: "TestUserToken2",
        private: true,
        username: "TestUsername2",
        full_name: "Test Fullname2"
      })
      .expect(200)
      .then(res => {
              let userID = res;
              request(server)
                .put("/users")
                .send({
                  insta_id: 3,
                  access_token: "TestUserTokenEdited",
                  private: true,
                  username: "TestUsernameEdited",
                  full_name: "Test FullnameEdited"
                })
                .expect(200)
      // .then(res => {
      //   let userID = res;
      //   request(server)
      //   .delete("/users")
      //   .query({ id: userID })
      //   .del()
      //   .expect(200)
      //     })
      })


  // it("POST new User + PUT + Delete User", async () => {
  //   return await request(server)
  //     .post("/users")
  //     .send({
  //       insta_id: 2,
  //       access_token: "User Access Token",
  //       private: true,
  //       username: "Username",
  //       full_name: "Fullname"
  //     })
  //     .expect(200)
  //     .then(res => {
  //       let userID = res;
  //       request(server)
  //         .put("/users")
  //         .send({
  //           insta_id: 3,
  //           access_token: "TestUserTokenEdited",
  //           private: true,
  //           username: "TestUsernameEdited",
  //           full_name: "Test FullnameEdited"
  //         })
  //         .expect(200)
  //         .then(res2 => {
  //           request(server)
  //             .delete("/users")
  //             .query({ id: userID })
  //             .expect(200)
  //         })
  //     })
   })
})