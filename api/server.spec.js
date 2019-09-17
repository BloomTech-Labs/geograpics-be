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

  it("POST new User + PUT User + DELETE User", async () => {
    return await request(server)
      .post("/users")
      .send({
        insta_id: 1,
        access_token: "TestUserToken",
        private: true,
        username: "TestUsername",
        full_name: "Test Fullname"
      })
      .expect(200)
      .then(res => {
        let userID = res;
        request(server)
          .put("/users")
          .send({
            insta_id: 2,
            access_token: "TestUserTokenEdited",
            private: true,
            username: "TestUsernameEdited",
            full_name: "Test FullnameEdited"
          })
          .expect(200);
      })
      // .then(res => {
      //   let userID = res;
      //   request(server)
      //   .delete("/users")
      //   .query({ id: userID })
      //   .del()
      //   .expect(200)
      //     })

      //         .then(res2 => {
      //           request(server)
      //             .delete("/users")
      //             .query({ id: userID })
      //             .expect(200)
      //         })
      //     })

      .then(res2 => {
        request(server)
          .delete(`/users/${userID}`)
          .expect(200);
      });

  });
});

// From Dustin Hamano: 


// describe("DELETE /auth/journal/:id", () => {
//   it("returns 401 Unauthorized", async () => {
//     let arr = await db("journal");
//     let id = arr[arr.length - 1].id;

//     return request(server)
//       .delete(`/auth/journal/${id}`)
//       .then(res => {
//         expect(res.status).toBe(401);
//       });
//   });

//   //  Code to DELETE from Dustin Hamano
//   it("returns 204 No Content Success", async () => {
//     let arr = await db("journal");
//     let id = arr[arr.length - 1].id;

//     return request(server)
//       .delete(`/auth/journal/${id}`)
//       .set("Authorization", token)
//       .then(res => {
//         expect(res.status).toBe(204);
//       });
//   });

//   it("removes from the database", async () => {
//     let arr = await db("journal");
//     let id = arr[arr.length - 1].id;

//     let before = await db("journal");
//     await request(server)
//       .delete(`/auth/journal/${id}`)
//       .set("Authorization", token);
//     let after = await db("journal");
//     expect(before.length - after.length).toBe(1);
//   });
// })
