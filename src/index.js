const express = require("express");
const req = require("express/lib/request");
const { json } = require("express/lib/response");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    userName: "jwt-user 1",
    title: "post 1",
  },
  {
    userName: "jwt-user 2",
    title: "post 2",
  },
];

app.get("/posts", authToken, (req, res) => {
  res.json(posts.filter((post) => post.userName === req.user.name));
});

app.post("/login", (req, res) => {
  //Authenticate
  const userName = req.body.userName;
  const user = { name: userName };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json(accessToken);
});

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
