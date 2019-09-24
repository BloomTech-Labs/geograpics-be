const localPg = {
  host: "localhost",
  database: "blah",
  user: "blah",
  password: "blah"
};
const testingDbConnection = process.env.DATABASE_URL || localPg;
const stagingDbConnection = process.env.DATABASE_URL || localPg;
const productionDbConnection = process.env.DATABASE_URL || localPg;

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/DB.db3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      }
    }
  },

  testing: {
    client: "pg",
    connection: testingDbConnection,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },

  staging: {
    client: "pg",
    connection: stagingDbConnection,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },

  production: {
    client: "pg",
    connection: productionDbConnection,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  }
};
