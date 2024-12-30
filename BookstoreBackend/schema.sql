CREATE DATABASE bookstore;
USE bookstore;

CREATE TABLE userTypes (
  userTypeID INT AUTO_INCREMENT PRIMARY KEY,
  userTypeName VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  userTypeID INT NOT NULL,
  FOREIGN KEY (userTypeID) REFERENCES userTypes(userTypeID)
);

CREATE TABLE languages (
  languageID INT AUTO_INCREMENT PRIMARY KEY,
  languageCode VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE publishers (
  publisherID INT AUTO_INCREMENT PRIMARY KEY,
  publisherName VARCHAR(255) NOT NULL
);

CREATE TABLE authors (
  authorID INT AUTO_INCREMENT PRIMARY KEY,
  authorName VARCHAR(255)
);

CREATE TABLE books (
  bookID INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  averageRating DECIMAL(3, 2),
  ISBN VARCHAR(10),
  ISBN13 VARCHAR(13),
  languageID INT,
  ratingsCount INT,
  textReviewsCount INT,
  publicationDate DATE,
  publisherID INT,
  FOREIGN KEY (languageID) REFERENCES languages(languageID),
  FOREIGN KEY (publisherID) REFERENCES publishers(publisherID)
);

CREATE TABLE bookAuthors (
  bookID INT NOT NULL,
  authorID INT NOT NULL,
  PRIMARY KEY (bookID, authorID),
  FOREIGN KEY (bookID) REFERENCES books(bookID),
  FOREIGN KEY (authorID) REFERENCES authors(authorID)
);

CREATE TABLE comments (
  commentID INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  bookID INT,
  usefulnessScore INT DEFAULT 0,
  body TEXT NOT NULL,
  FOREIGN KEY (email) REFERENCES users(email),
  FOREIGN KEY (bookID) REFERENCES books(bookID)
);

CREATE TABLE trustRelationships (
  truster VARCHAR(255) NOT NULL,
  trustee VARCHAR(255) NOT NULL,
  PRIMARY KEY (truster, trustee),
  FOREIGN KEY (truster) REFERENCES users(email),
  FOREIGN KEY (trustee) REFERENCES users(email)
);

CREATE TABLE orders (
  orderID INT AUTO_INCREMENT PRIMARY KEY,
  bookID INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  count INT,
  FOREIGN KEY (bookID) REFERENCES books(bookID),
  FOREIGN KEY (email) REFERENCES users(email)
);
