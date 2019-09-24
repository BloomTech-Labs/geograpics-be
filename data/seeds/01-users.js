exports.seed = function(knex, Promise) {
  return knex('users').insert([
    {
      access_token: "blahblah0",
      private: false,
      insta_id: 1574083,
      username: "joseph",
      profile_pic: "",
      full_name: "Joseph Garcia",
      bio: "",
      website: "",
      is_business: false,
      email: "asdf1@asdf.com"
    },
    {
      access_token: "blahblah1",
      private: false,
      insta_id: 1574084,
      username: "anthony",
      profile_pic: "",
      full_name: "Anthony Piazza",
      bio: "",
      website: "",
      is_business: false,
      email: "asdf2@asdf.com"
    },
    {
      access_token: "blahblah2",
      private: false,
      insta_id: 1574085,
      username: "benjamin",
      profile_pic: "",
      full_name: "Benjamin Peck",
      bio: "",
      website: "",
      is_business: false,
      email: "asdf3@asdf.com"
    },
    {
      access_token: "blahblah3",
      private: false,
      insta_id: 1574086,
      username: "dustin",
      profile_pic: "",
      full_name: "Dustin Hamano",
      bio: "",
      website: "",
      is_business: false,
      email: "asdf4@asdf.com"
    },
  ])
}