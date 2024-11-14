// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static("./views/resources"));

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

app.get('/', (req, res) => {
    res.redirect('/home'); //this will call the /anotherRoute route in the API
});

app.get('/all', (req, res) => {
    all = `select * from users;`;
    db.task('get-everything', task => {
        return task.batch([task.any(all)]);
    })
        .then(data => {
            res.status(200).json({
                data: data[0]
            });
        })
        .catch(err => {
            console.log('Uh Oh spaghettio');
            console.log(err);
            res.status('400').json({
                data: '',
            });
        });
});

app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });

// -------------------------------------  ROUTES for register.hbs   ----------------------------------------------
const user = {
    username: undefined,
    password: undefined,
};

app.get('/register', (req, res) => {
    if (req.session.user) {
        res.render('pages/UhOh', {
            error: true,
            message: "Can't load register until you log out!",
        });
    }
    else {
    res.render('pages/register');
    }
});

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) returning * ;';
    db.any(query, [
        username,
        hash
    ])
        .then(data => {
            // TEST CASE
            res.status('200').json({message: 'Successfully created account!'});
            
            /*
            res.render('pages/login', {
                message: "Successfully created account!",
            });
            */
        })
        .catch(err => {
            console.log(err);
            // TEST CASE
            res.status('400').json({message: 'Something went wrong. Either your username was invalid or is already taken!'});

            /*
            res.render('pages/register', {
                error: true,
                message: "Something went wrong. Either your username was invalid or is already taken!",
            });
            */
        });
});

// -------------------------------------  ROUTES for login.hbs   ----------------------------------------------
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.render('pages/UhOh', {
            error: true,
            message: "Can't load login until you log out!",
        });
    }
    else {
    res.render('pages/login', {
        message: undefined,
    });
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const query = 'select * from users where users.username = $1 LIMIT 1';
    const values = [username];

    db.one(query, values)
        .then(async data => {
            
            // TEST CASE
            // res.status('200').json({message: 'Successfully logged in!'});

            // /*
            user.username = data.username;
            user.password = data.password;
            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {
                req.session.user = user;
                req.session.save();

                res.redirect('/home');
            }
            else {
                res.render('pages/login', {
                    error: true,
                    message: "Incorrect password.",
                });
            }
            // */
        })
        .catch(err => {
            console.log(err);
            // TEST CASE
            res.status('400').json({message: 'Incorrect login information, maybe try registering.'});

            // /*
            res.render('pages/register', {
                error: true,
                message: "Incorrect login information, maybe try registering.",
            });
            // */
        });
});

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
        // Default to login page.
        return res.redirect('/login');
    }
    next();
};

// Authentication Required
app.use(auth);

// -------------------------------------  ROUTES for HOME(?).hbs   ----------------------------------------------
app.get('/home', (req, res) => {
    res.render('pages/home', {
        message: undefined,
    });
});

// -------------------------------------  ROUTES for PROFILE.hbs   ----------------------------------------------
app.get('/profile', async (req, res) => {
    try {
        console.log('Session:', req.session);
        console.log('Session user:', req.session.user);

        // Check if user is logged in
        if (!req.session.user) {
            console.log('No session user found - redirecting to login');
            return res.redirect('/login');
        }

        // Fetch user data
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        console.log('Executing user query:', userQuery);
        const userData = await db.one(userQuery, [req.session.user.username]);
        console.log('User data result:', userData);

        // Fetch user stats
        const statsQuery = 'SELECT stat_type, stat_value FROM user_stats WHERE username = $1';
        console.log('Executing stats query:', statsQuery);
        const statsData = await db.any(statsQuery, [req.session.user.username]);
        console.log('Stats data result:', statsData);

        // Format the data for the template
        const user = {
            username: req.session.user.username,
            profileImage: userData.profile_image_path,
            bio: userData.bio,
            stats: statsData.map(stat => ({
                label: stat.stat_type,
                value: stat.stat_value
            }))
        };
        console.log('Final user object being sent to template:', user);

        res.render('pages/profile', { user });
    } catch (error) {
        console.error('Error in profile route:', error);
        res.status(500).send('Server error');
    }
});

// -------------------------------------  ROUTES for logout.hbs   ----------------------------------------------
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/logout', {
        message: "Successfully Logged Out!"
    });
});

// -------------------------------------  ROUTES for play_singleplayer.hbs   ----------------------------------------------
app.get('/play_singleplayer', (req, res) => {
    res.render('pages/play_singleplayer', {
        message: undefined,
    });
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');