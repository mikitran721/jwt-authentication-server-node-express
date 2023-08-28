require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middelware/auth");

const app = express();

// request chay dc khi gui post theo application.json
// khi do app moi doc duoc du lieu json tu request
app.use(express.json());

// data base

const posts = [
  { userId: 1, post: "post poo" },
  { userId: 2, post: "post phoong" },
  { userId: 1, post: "post p002" },
];

// app
// route posts dc bao ve boi verifyToken - middleware
app.get("/posts", verifyToken, (req, res) => {
  // res.json({ posts: "my posts" });
  res.json(posts.filter((post) => post.userId === req.userId));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
