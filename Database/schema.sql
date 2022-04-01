CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    pfpPath TEXT DEFAULT "public/pfp/pfp.png"
);

CREATE TABLE IF NOT EXISTS Posts (
    postID TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    subject TEXT NOT NULL,
    post TEXT NOT NULL,
    date INT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    FOREIGN KEY(author) REFERENCES Users(username)
);

CREATE TABLE IF NOT EXISTS Comments (
    commentID TEXT PRIMARY KEY,
    author TEXT UNIQUE NOT NULL,
    post TEXT UNIQUE NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    FOREIGN KEY(author) REFERENCES Users(username),
    FOREIGN KEY(post) REFERENCES Posts(postID)
);