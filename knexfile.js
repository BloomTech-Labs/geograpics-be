const localPg = {
  host: 'localhost',
  database: 'blah',
  user: 'blah',
  password: 'blah',
}
const testingDbConnection = process.env.DATABASE_URL || localPg;
const stagingDbConnection = process.env.DATABASE_URL || localPg;
const productionDbConnection = process.env.DATABASE_URL || localPg;

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './api/data/DB.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './api/data/migrations'
    },
    seeds: {
      directory: './api/data/seeds'
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    }
  },

  testing: {
    client: 'pg',
    connection: testingDbConnection,
    migrations: {
      directory: './api/data/migrations'
    },
    seeds: {
      directory: './api/data/seeds'
    },
  },

  staging: {
    client: 'pg',
    connection: stagingDbConnection,
    migrations: {
      directory: './api/data/migrations'
    },
    seeds: {
      directory: './api/data/seeds'
    },
  },

  production: {
    client: 'pg',
    connection: productionDbConnection,
    migrations: {
      directory: './api/data/migrations'
    },
    seeds: {
      directory: './api/data/seeds'
    },
  }

};
