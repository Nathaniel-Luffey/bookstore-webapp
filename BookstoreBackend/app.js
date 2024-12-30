import express from 'express'
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import { getUsers, getUser, login, registerUser, titleSearch, authorSearch, publisherSearch, languageSearch, getManagerStatus, giveManager, getComments, voteComment, addComment, getUserDetails, getProfileComments, trustCheck, changeTrust, addOrder, addBook, getStats} from './database.js';

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

app.get("/user/:email", async (req, res) => {
  const email = req.params.email;
  const user = await getUser(email);
  res.send(user);
});

app.post("/login", async (req, res) => {
  console.log("Login request received.");
  const { email, password } = req.body;
  const result = await login(email, password);
  res.send(result);
})

app.post("/registerUser", async (req, res) => {
  console.log("Register request received.");
  const { email, firstName, lastName, password, userTypeID } = req.body;
  const user = await registerUser(email, firstName, lastName, password, userTypeID);
  res.status(201).send(user);
});

app.post("/searchTitle", async (req, res) => {
  console.log("Title search request received.");
  const { search } = req.body;
  const result = await titleSearch(search);
  res.send(result);
});

app.post("/searchAuthor", async (req, res) => {
  console.log("Author search request received.");
  const { search } = req.body;
  const result = await authorSearch(search);
  res.send(result);
});

app.post("/searchPublisher", async (req, res) => {
  console.log("Publisher search request received.");
  const { search } = req.body;
  const result = await publisherSearch(search);
  res.send(result);
});

app.post("/searchLanguage", async (req, res) => {
  console.log("Language search request received.");
  const { search } = req.body;
  const result = await languageSearch(search);
  res.send(result);
});

app.post("/getManagerStatus", async (req, res) => {
  console.log("Get manager status request received.");
  const { email } = req.body;
  const result = await getManagerStatus(email);
  res.send(result);
});

app.post("/giveManager", async (req, res) => {
  console.log("Give manager request received.");
  const { enteredEmail } = req.body;
  const result = await giveManager(enteredEmail);
  res.send(result);
});

app.post("/getComments", async (req, res) => {
  console.log("Get comment request received.");
  const { bookID } = req.body;
  const result = await getComments(bookID);
  res.send(result);
});

app.post("/voteComment", async (req, res) => {
  console.log("Vote comment request received.");
  const { commentID, value } = req.body;
  const result = await voteComment(commentID, value);
  res.send(result);
});

app.post("/addComment", async (req, res) => {
  console.log("Add comment request received.");
  const { bookID, email, draftComment } = req.body;
  const result = await addComment(bookID, email, draftComment);
  res.send(result);
});

app.post("/getUserDetails", async (req, res) => {
  console.log("User details request received");
  const { viewingEmail } = req.body;
  const result = await getUserDetails(viewingEmail);
  res.send(result);
});

app.post("/getProfileComments", async (req, res) => {
  console.log("Get profile comment request received.");
  const { viewingEmail } = req.body;
  const result = await getProfileComments(viewingEmail);
  res.send(result);
});

app.post("/trustCheck", async (req, res) => {
  console.log("Trust check request has been received.");
  const { email, viewingEmail } = req.body;
  const result = await trustCheck(email, viewingEmail);
  console.log(result);
  res.send(result);
});

app.post("/changeTrust", async (req, res) => {
  console.log("Trust change request has been received.");
  const { email, viewingEmail } = req.body;
  const result = await changeTrust(email, viewingEmail);
  res.send(result);
});

app.post("/addOrder", async (req, res) => {
  console.log("Add order request has been received.");
  const { bookID, email, orderValue } = req.body;
  const result = await addOrder(bookID, email, orderValue);
  res.send(result);
});

app.post("/addBook", async (req, res) => {
  console.log("Add book request has been received.");
  const { title, averageRating, ISBN, ISBN13, languageCode, ratingsCount, textReviewsCount, publicationDate, publisherName } = req.body;
  const result = await addBook(title, averageRating, ISBN, ISBN13, languageCode, ratingsCount, textReviewsCount, publicationDate, publisherName);
  res.send(result);
});

app.post("/getStats", async (req, res) => {
  console.log("Get Stats request has been received.");
  const result = await getStats();
  res.send(result);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});