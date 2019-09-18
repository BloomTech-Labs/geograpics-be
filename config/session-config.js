module.exports = sessionOptions = {
    name: 'auth-users',
    secret: process.env.COOKIE_SECRET || 'keep it funny', // for encryption
    cookie: {
        secure: false, // HTTP or HTTPs
        maxAge: 24 * 60 * 60 * 1000, //how long is the session good for ms
        httpOnly: true, //client JS has no access to the cookie
    },
    resave: false,
    saveUninitialized: true,
    // store: new KnexSessionStore({
    //     knex: knexConnection,
    //     createtable: true,
    //     clearInterval: 1000 * 60 * 60 // how long before we clear out expired sessions
    // })
}

