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
    host: process.env.HOST, // the database server
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
    res.json({ status: 'success', message: 'Welcome!' });
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
    const query = 'INSERT INTO users (username, password, games_played, total_guesses, wins, losses) VALUES ($1, $2, 0, 0, 0, 0) returning * ;';
    db.any(query, [
        username,
        hash
    ])
        .then(data => {
            // TEST CASE
            // res.status('200').json({message: 'Successfully created account!'});

            // /*
            res.render('pages/login', {
                message: "Successfully created account!",
            });
            // */
        })
        .catch(err => {
            console.log(err);
            // TEST CASE
            // res.status('400').json({message: 'Something went wrong. Either your username was invalid or is already taken!'});

            // /*
            res.render('pages/register', {
                error: true,
                message: "Something went wrong. Either your username was invalid or is already taken!",
            });
            // */
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
            // res.status('400').json({message: 'Incorrect login information, maybe try registering.'});

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
        /*
        const statsQuery = 'SELECT stat_type, stat_value FROM user_stats WHERE username = $1';
        console.log('Executing stats query:', statsQuery);
        const statsData = await db.any(statsQuery, [req.session.user.username]);
        console.log('Stats data result:', statsData);
        */

        // Format the data for the template
        const user = {
            username: req.session.user.username,
            profileImage: userData.profile_image_path,
            bio: userData.bio,
            games_played: userData.games_played,
            total_guesses: userData.total_guesses,
            wins: userData.wins,
            losses: userData.losses,
            friends: userData.friends,
            pendingfriends: userData.pendingfriends
        };
        console.log('Final user object being sent to template:', user);

        const message = req.session.message;
        const error = req.session.error;
        req.session.message = req.session.error = null;

        res.render('pages/profile', { user, message, error });

    } catch (error) {
        console.error('Error in profile route:', error);
        res.status(500).send('Server error');
    }
});

app.post('/profile/bio', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            console.log('No session user found - redirecting to login');
            return res.redirect('/login');
        }

        const { bio } = req.body;
        const username = req.session.user.username;

        // Update the bio in the database
        const updateQuery = 'UPDATE users SET bio = $1 WHERE username = $2 RETURNING *';
        console.log('Executing update query:', updateQuery);
        await db.one(updateQuery, [bio, username]);

        // Redirect back to profile page to see the changes
        res.redirect('/profile');

    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).send('Server error');
    }
});

app.post('/profile/settings', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        console.log('Form data received:', req.body);  // Debug line

        const currentUsername = req.session.user.username;
        const { username, password } = req.body;

        // Handle username change
        if (username && username !== currentUsername) {
            // Check if new username is available
            const userExists = await db.oneOrNone('SELECT username FROM users WHERE username = $1', [username]);
            if (userExists) {
                req.session.message = 'Username already taken';
                req.session.error = true;
                return res.redirect('/profile');
            }

            // Update username in all tables
            await db.tx(async t => {
                await t.none('UPDATE users SET username = $1 WHERE username = $2', [username, currentUsername]);
            });

            // Update session
            req.session.user.username = username;
        }

        // Handle password change
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.none('UPDATE users SET password = $1 WHERE username = $2',
                [hashedPassword, username || currentUsername]);
            req.session.user.password = hashedPassword;
        }

        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Error updating profile: ' + error.message);
    }
});

app.post('/profile/friends', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        console.log('Form data received:', req.body);  // Debug line

        // Finding Input and Current User
        const currentUsername = req.session.user.username;
        const { friendsusername } = req.body;

        // Check for self-add
        if (friendsusername == currentUsername) {
            req.session.message = 'You can\'t add yourself silly!';
            req.session.error = true;
            return res.redirect('/profile');
        }

        // Check for friend's existence (sad I know)
        const userExists = await db.oneOrNone('SELECT username FROM users WHERE username = $1', [friendsusername]);
        if (!userExists) {
            req.session.message = 'Nobody found with that Username!';
            req.session.error = true;
            return res.redirect('/profile');
        }

        // Checks if Added
        const AlreadyAddedFriends = await db.one('SELECT $2 = ANY(friends) AS result FROM users WHERE username = $1', [currentUsername, friendsusername]);
        const AlreadyAddedPendingSent = await db.one('SELECT $2 = ANY(pendingfriends) AS result FROM users WHERE username = $1', [friendsusername, currentUsername]);
        const AlreadyAddedPendingHas = await db.one('SELECT $1 = ANY(pendingfriends) AS result FROM users WHERE username = $2', [friendsusername, currentUsername]);
        console.log('ArrayFriends: ', AlreadyAddedFriends.result);  // Debug line
        console.log('ArrayPendingSent: ', AlreadyAddedPendingSent.result);  // Debug line
        console.log('ArrayPendingHas: ', AlreadyAddedPendingHas.result);  // Debug line

        if((AlreadyAddedFriends.result == true)||(AlreadyAddedPendingSent.result == true)||(AlreadyAddedPendingHas.result == true)) {
            req.session.message = 'Can\'t add a friend, someone you\'ve added, or someone who\'s added you silly!';
            req.session.error = true;
            return res.redirect('/profile');
        }
        
        // Add Friend
        await db.tx(async t => {
            await t.none(
                'UPDATE users SET pendingfriends = ARRAY_APPEND(pendingfriends, $2) WHERE username = $1',
                [friendsusername, currentUsername]
            );
        });

        req.session.message = 'Successfully added user!';
        return res.redirect('/profile');

    } catch (error) {
        console.error('Error adding pending friend:', error);
        res.status(500).send('Error adding pending friend: ' + error.message);
    }
});

app.post('/profile/denyrequest', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Finding Input and Current User
        const currentUsername = req.session.user.username;
        const friendsusername = req.body.usersent;


        // Check for friend's existence (sad I know)
        const userExists = await db.oneOrNone('SELECT username FROM users WHERE username = $1', [friendsusername]);
        if (!userExists) {
            req.session.message = 'Nobody found with that Username!';
            req.session.error = true;
            await db.tx(async t => {
                await t.none(
                    'UPDATE users SET pendingfriends = ARRAY_REMOVE(pendingfriends, $1) WHERE username = $2',
                    [friendsusername, currentUsername]
                );
            })
            return res.redirect('/profile');
        }

        // Deny Friend
        await db.tx(async t => {
            await t.none(
                'UPDATE users SET pendingfriends = ARRAY_REMOVE(pendingfriends, $1) WHERE username = $2',
                [friendsusername, currentUsername]
            );
        })

        req.session.message = 'Successfully denied user!';
        return res.redirect('/profile');

    } catch (error) {
        console.error('Error denying friend', error);
        res.status(500).send('Error denying friend: ' + error.message);
    }
});

app.post('/profile/acceptrequest', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Finding Input and Current User
        const currentUsername = req.session.user.username;
        const friendsusername = req.body.usersent;


        // Check for friend's existence (sad I know)
        const userExists = await db.oneOrNone('SELECT username FROM users WHERE username = $1', [friendsusername]);
        if (!userExists) {
            req.session.message = 'Nobody found with that Username!';
            req.session.error = true;
            await db.tx(async t => {
                await t.none(
                    'UPDATE users SET pendingfriends = ARRAY_REMOVE(pendingfriends, $1) WHERE username = $2',
                    [friendsusername, currentUsername]
                );
            })
            return res.redirect('/profile');
        }

        // Accept Friend
        await db.tx(async t => {
            await t.none(
                'UPDATE users SET pendingfriends = ARRAY_REMOVE(pendingfriends, $1) WHERE username = $2',
                [friendsusername, currentUsername]
            );
            await t.none(
                'UPDATE users SET friends = ARRAY_APPEND(friends, $1) WHERE username = $2',
                [friendsusername, currentUsername]
            );
            await t.none(
                'UPDATE users SET friends = ARRAY_APPEND(friends, $2) WHERE username = $1',
                [friendsusername, currentUsername]
            );
        })

        req.session.message = 'Successfully accepted user as a friend!';
        return res.redirect('/profile');

    } catch (error) {
        console.error('Error denying friend', error);
        res.status(500).send('Error denying friend: ' + error.message);
    }
});

app.post('/profile/remove', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Finding Input and Current User
        const currentUsername = req.session.user.username;
        const friendsusername = req.body.usersent;


        // Check for friend's existence (sad I know)
        const userExists = await db.oneOrNone('SELECT username FROM users WHERE username = $1', [friendsusername]);
        if (!userExists) {
            req.session.message = 'Nobody found with that Username!';
            req.session.error = true;
            await db.tx(async t => {
                await t.none(
                    'UPDATE users SET friends = ARRAY_REMOVE(friends, $1) WHERE username = $2',
                    [friendsusername, currentUsername]
                );
            })
            return res.redirect('/profile');
        }

        // Remove Friend
        await db.tx(async t => {
            await t.none(
                'UPDATE users SET friends = ARRAY_REMOVE(friends, $1) WHERE username = $2',
                [friendsusername, currentUsername]
            );
        })

        await db.tx(async t => {
            await t.none(
                'UPDATE users SET friends = ARRAY_REMOVE(friends, $2) WHERE username = $1',
                [friendsusername, currentUsername]
            );
        })

        req.session.message = 'Successfully removed user!';
        return res.redirect('/profile');

    } catch (error) {
        console.error('Error removing friend', error);
        res.status(500).send('Error removing friend: ' + error.message);
    }
});

app.post('/api/updateStats', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const username = req.session.user.username;
        const { gamesPlayed, totalGuesses, wins, losses } = req.body;

         // If it's a win, increment streak; if loss, reset to 0
         const streakUpdate = wins === 1 ? 
         'current_streak + 1' : 
         '0';

        const query = `
            UPDATE users 
            SET games_played = games_played + $1,
                total_guesses = total_guesses + $2,
                wins = wins + $3,
                losses = losses + $4,
                current_streak = ${streakUpdate}
            WHERE username = $5
            RETURNING games_played, total_guesses, wins, losses, current_streak
        `;

        const result = await db.one(query, [
            gamesPlayed,
            totalGuesses,
            wins,
            losses,
            username
        ]);

        res.json(result);
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ error: 'Failed to update stats' });
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