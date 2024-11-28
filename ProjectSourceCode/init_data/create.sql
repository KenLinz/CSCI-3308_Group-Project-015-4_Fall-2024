-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--   username VARCHAR(50) PRIMARY KEY,
--   password CHAR(60) NOT NULL
-- );


-- Users table (core user information)
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL,
    profile_image_path VARCHAR(255),
    bio TEXT,
    games_played INTEGER NOT NULL,
    total_guesses INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 0,
    friends TEXT [],
    pendingfriends TEXT []
);



DROP TABLE IF EXISTS versus_active CASCADE;
CREATE TABLE versus_active (
    usersent TEXT,
    userrecieved TEXT,
    wordleword TEXT,
    usersent_guesses INTEGER
);



DROP TABLE IF EXISTS versus_stats CASCADE;
CREATE TABLE versus_stats (
    userdata TEXT,
    useraffected TEXT,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    ties INTEGER NOT NULL
);