CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    pfpPath TEXT DEFAULT "/pfp/pfp.png"
);

CREATE TABLE IF NOT EXISTS ForgottenPass (
    tempID TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    expiration INTEGER NOT NULL,
    FOREIGN KEY(email) REFERENCES Users(email)
);

CREATE TABLE IF NOT EXISTS Posts (
    postID TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    subject TEXT NOT NULL,
    post TEXT NOT NULL,
    date INT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    FOREIGN KEY(author) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS PostLikes (
    postID TEXT,
    userID TEXT NOT NULL,
    FOREIGN KEY (postID) REFERENCES Posts(postID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS Comments (
    commenter TEXT,
    post TEXT,
    commentText TEXT,
    date INT NOT NULL,
    FOREIGN KEY(commenter) REFERENCES Users(userID),
    FOREIGN KEY(post) REFERENCES Posts(postID)
);

CREATE TABLE IF NOT EXISTS Booklist (
    bookID TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    yearPub INTEGER NOT NULL,
    siteRating INT NOT NULL DEFAULT 0
);

-- CREATE TABLE IF NOT EXISTS Review (
--     bookID TEXT PRIMARY KEY,
--     reviewer TEXT UNIQUE NOT NULL,
--     review TEXT,
--     indivRating INT NOT NULL CHECK (indivRating >= 0 AND indivRating <= 5),
--     date INT NOT NULL,
--     FOREIGN KEY (reviewer) REFERENCES Users(userID)
--     FOREIGN KEY (bookID) REFERENCES Booklist(bookID)
-- );