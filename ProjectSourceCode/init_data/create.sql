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
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    total_guesses INTEGER NOT NULL
);

/*
-- Stats table (one-to-many relationship with users)
DROP TABLE IF EXISTS user_stats;
CREATE TABLE user_stats (
    stat_id SERIAL PRIMARY KEY,
    username VARCHAR(50) REFERENCES users(username),
    stat_type VARCHAR(50) NOT NULL,  -- e.g., 'games_played', 'wins', 'losses', 'average_guesses'
    stat_value INTEGER NOT NULL,
    UNIQUE(username, stat_type)
);
*/

-- Friends table (many-to-many relationship)
DROP TABLE IF EXISTS friends;
CREATE TABLE friends (
    friendship_id SERIAL PRIMARY KEY,
    user1_username VARCHAR(50) REFERENCES users(username),
    user2_username VARCHAR(50) REFERENCES users(username),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (user1_username < user2_username), -- Ensures unique friendships
    UNIQUE(user1_username, user2_username)
);
