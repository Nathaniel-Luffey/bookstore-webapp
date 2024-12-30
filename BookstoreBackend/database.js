import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise()

export async function getUsers() {
  const [users] = await pool.query(`SELECT * FROM users`);
  return users;
};

export async function getUser(email) {
  const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  console.log(user);
  return user[0];
};

export async function login(email, password) {
  const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  
  if (!user[0]) {
    return {success: false, message: "User not found!"};
  }
  
  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (isPasswordValid) {
    return {success: true, message: "Logging in!"};
  }
  else {
    return {success: false, message: "Incorrect credentials!"};
  }
};

export async function registerUser(email, firstName, lastName, password, userTypeID) {
  if (!email || !firstName || !lastName || !password || !userTypeID) {
    console.log(email, password, firstName, lastName, userTypeID);
    return { success: false, message: "All fields are required!" };
  }
  
  const checkUser = await getUser(email);

  if (checkUser) {
    return {success: false, message: "User already exists!"};
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query('INSERT INTO users (email, firstName, lastName, password, userTypeID) VALUES (?, ?, ?, ?, ?)', [email, firstName, lastName, hashedPassword, userTypeID]);
  if (result) {
    return {success: true, message: "User registered successfully!"};
  }
  else {
    return {success: false, message: "Error entering user into database!"}
  }
};

export async function titleSearch(search) {
  const searchTerm = `%${search}%`;
  const [result] = await pool.query(`
    SELECT 
    b.*,
    a.authorName AS author, 
    p.publisherName AS publisher, 
    l.languageCode AS language
    FROM books b
    LEFT JOIN bookAuthors ba ON b.bookID = ba.bookID
    LEFT JOIN authors a ON ba.authorID = a.authorID
    LEFT JOIN publishers p ON b.publisherID = p.publisherID
    LEFT JOIN languages l ON b.languageID = l.languageID
    WHERE b.title LIKE ?;`, [searchTerm]);
  console.log(result);
  return result;
};

export async function authorSearch(search) {
  const searchTerm = `%${search}%`;
  const [result] = await pool.query(`
    SELECT 
    b.*, 
    a.authorName AS author, 
    p.publisherName AS publisher, 
    l.languageCode AS language
    FROM books b
    LEFT JOIN bookAuthors ba ON b.bookID = ba.bookID
    LEFT JOIN authors a ON ba.authorID = a.authorID
    LEFT JOIN publishers p ON b.publisherID = p.publisherID
    LEFT JOIN languages l ON b.languageID = l.languageID
    WHERE a.authorName LIKE ?;`, [searchTerm]);
  console.log(result);
  return result;
};

export async function publisherSearch(search) {
  const searchTerm = `%${search}%`;
  const [result] = await pool.query(`
    SELECT 
    b.*, 
    a.authorName AS author, 
    p.publisherName AS publisher, 
    l.languageCode AS language
    FROM books b
    LEFT JOIN bookAuthors ba ON b.bookID = ba.bookID
    LEFT JOIN authors a ON ba.authorID = a.authorID
    LEFT JOIN publishers p ON b.publisherID = p.publisherID
    LEFT JOIN languages l ON b.languageID = l.languageID
    WHERE p.publisherName LIKE ?;`, [searchTerm]);
  console.log(result);
  return result;
};

export async function languageSearch(search) {
  const searchTerm = `%${search}%`;
  const [result] = await pool.query(`
    SELECT 
    b.*, 
    a.authorName AS author, 
    p.publisherName AS publisher, 
    l.languageCode AS language
    FROM books b
    LEFT JOIN bookAuthors ba ON b.bookID = ba.bookID
    LEFT JOIN authors a ON ba.authorID = a.authorID
    LEFT JOIN publishers p ON b.publisherID = p.publisherID
    LEFT JOIN languages l ON b.languageID = l.languageID
    WHERE l.languageCode LIKE ?;`, [searchTerm]);
  console.log(result);
  return result;
};

export async function getManagerStatus(email) {
  const [result] = await pool.query(`SELECT userTypeID FROM users WHERE email = ?`, [email]);
  const userTypeID = result[0].userTypeID;
  if (userTypeID == 1) {
    return {success: true, message: "User is a manager!"};
  }
  else {
    return {success: false, message: "User is not a manager!"};
  }
};

export async function giveManager(email) {
  const [rows] = await pool.query(`SELECT userTypeID FROM users WHERE email = ?`, [email]);
  if (rows.length > 0) {
    const userTypeID = rows[0].userTypeID;
    if (userTypeID == 1) {
      return {success: false, message: "User is already a manager!"};
    }
    else if (userTypeID == 2) {
      await pool.query(`UPDATE users SET userTypeID = 1 WHERE email = ?`, [email]);
      return {success: true, message: "User changed to manager!"};
    }
  }
  else {
    return {success: false, message: "User not found!"};
  }
};

export async function getComments(bookID) {
  const [result] = await pool.query(`SELECT * FROM comments WHERE bookID = ?`, [bookID]);
  console.log(result);
  return(result);
};

export async function voteComment(commentID, value) {
  const [commentScore] = await pool.query(`SELECT usefulnessScore FROM comments WHERE commentID = ?`, [commentID]);
  console.log(commentScore);
  const updatedCommentScore = commentScore[0].usefulnessScore + value;
  console.log(updatedCommentScore);
  const [result] = await pool.query(`UPDATE comments SET usefulnessScore = ? WHERE commentID = ?`, [updatedCommentScore, commentID]);
  
  if (result) {
    return {success: true, message: "Vote registered successfully!"};
  }
  else {
    return {success: false, message: "Error entering vote into database!"};
  }
};

export async function addComment(bookID, email, draftComment) {
  if (draftComment !== '') {
    const [result] = await pool.query(`INSERT INTO comments (bookID, email, body) VALUES (?, ?, ?)`, [bookID, email, draftComment]);
    console.log(result);
    return {success: true, message: "Comment added successfully!"};
  }
  else {
    return {success: false, message: "No comment body!"};
  }
};

export async function getUserDetails(email) {
  const [result] = await pool.query(`SELECT firstName, lastName FROM users WHERE email = ?`, [email]);
  return(result[0]);
};

export async function getProfileComments(email) {
  const [result] = await pool.query(`
    SELECT comments.commentID, comments.body, comments.usefulnessScore, comments.email, books.title
    FROM comments
    JOIN books ON comments.bookID = books.bookID
    WHERE comments.email = ?`, [email]);
  return(result);
};

export async function trustCheck(truster, trustee) {
  const [result] = await pool.query(`SELECT * FROM trustRelationships WHERE truster = ? AND trustee = ?`, [truster, trustee]);
  const [rows] = await pool.query(`SELECT * FROM trustRelationships WHERE trustee = ?`, [trustee]);
  const count = rows.length;
  if (result.length > 0) {
    return {success: true, count: count};
  }
  else {
    return {success: false, count: count};
  }
};

export async function changeTrust(truster, trustee) {
  const [result] = await pool.query(`SELECT * FROM trustRelationships WHERE truster = ? AND trustee = ?`, [truster, trustee]);
  if (result.length > 0) {
    await pool.query(`DELETE FROM trustRelationships WHERE truster = ? AND trustee = ?`, [truster, trustee]);
    return {checked: false};
  }
  else {
    await pool.query(`INSERT INTO trustRelationships (truster, trustee) VALUES (?, ?)`, [truster, trustee]);
    return {checked: true};
  }
};

export async function addOrder(bookID, email, count) {
  const [result] = await pool.query(`INSERT INTO orders (bookID, email, count) VALUES (?, ?, ?)`, [bookID, email, count]);
  console.log(result);
  if (result.affectedRows > 0) {
    return {message: `Order placed under ${email}`};
  }
  else {
    return {message: 'Order failed to place.'};
  }
};

export async function addBook(title, averageRating, ISBN, ISBN13, languageCode, ratingsCount, textReviewsCount, publicationDate, publisherName) {
  console.log(publisherName);
  const [selectPublisherResult] = await pool.query(`SELECT publisherID FROM publishers WHERE publisherName = ?`, [publisherName]);
  let publisherID;
  let languageID;

  if (selectPublisherResult.length > 0) {
    publisherID = selectPublisherResult[0].publisherID;
  }
  else {
    const [insertPublisherResult] = await pool.query(`INSERT INTO publishers (publisherName) VALUES (?)`, [publisherName]);
    publisherID = insertPublisherResult.insertId;
  }

  const [selectLanguageResult] = await pool.query(`SELECT languageID FROM languages WHERE languageCode = ?`, [languageCode]);
  if (selectLanguageResult.length > 0) {
    languageID = selectLanguageResult[0].languageID;
  }
  else {
    const [insertLanguageResult] = await pool.query(`INSERT INTO languages (languageCode) VALUES (?)`, [languageCode]);
    languageID = insertLanguageResult.insertId;
  }

  const [bookResult] = await pool.query(`INSERT INTO books (title, averageRating, ISBN, ISBN13, languageID, ratingsCount, textReviewsCount, publicationDate, publisherID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [title, averageRating, ISBN, ISBN13, languageID, ratingsCount, textReviewsCount, publicationDate, publisherID]);
  
  if (bookResult.affectedRows > 0) {
    return {success: true, message: 'Book added!'};
  }
  else {
    return {success: false, message: 'Book failed to add!'};
  }
};

export async function getStats() {
  const [bestSeller] = await pool.query(`SELECT books.title, 
    SUM(orders.count) AS count 
    FROM orders 
    JOIN books 
    ON orders.bookID = books.bookID 
    GROUP BY books.bookID 
    ORDER BY count DESC
    LIMIT 1`);

  const [bestCustomer] = await pool.query(`SELECT users.email, 
    SUM(orders.count) AS count 
    FROM orders 
    JOIN users 
    ON orders.email = users.email 
    GROUP BY users.email 
    ORDER BY count DESC 
    LIMIT 1`);

    return {bestSeller: bestSeller[0].title, bestSellerCopies: bestSeller[0].count, bestCustomer: bestCustomer[0].email, bestCustomerOrderCount: bestCustomer[0].count};
};