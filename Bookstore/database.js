import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'rVUsAfhR7xnaELrG!$',
  database: 'bookstore'
}).promise()

async function getUsers() {
  const users = await pool.query(`SELECT * FROM users`);
  return users;
};

async function getUser(email) {
  const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  console.log(user);
  return user[0];
}

async function registerUser(email, firstName, lastName, password, userTypeID) {
  const checkUser = await getUser(email);
  if (checkUser) {
    console.log("User already exists!");
    return {success: false, message: "User already exists!"};
  }

  const [result] = await pool.query('INSERT INTO users (email, firstName, lastName, password, userTypeID) VALUES (?, ?, ?, ?, ?)', [email, firstName, lastName, password, userTypeID]);
  if (result) {
    console.log("User registered successfully!", result);
    return {success: true, message: "User registered successfully!"};
  }
}

