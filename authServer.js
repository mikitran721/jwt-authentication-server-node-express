require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middelware/auth");

const app = express();

// request chay dc khi gui post theo application.json
// khi do app moi doc duoc du lieu json tu request
app.use(express.json());

// data base
let users = [
  {
    id: 1,
    username: "poo",
    refreshToken: null,
  },
  {
    id: 2,
    username: "phoong",
    refreshToken: null,
  },
];

// app

const generateTokens = (payload) => {
  const { id, username } = payload;

  // create JWT (username==key,secret)
  const accessToken = jwt.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );

  // tao refresh token khi user dang nhap lan1
  // refreshtoken nay se duoc luu va db ben canh user, khi ho login lan dau
  const refreshToken = jwt.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { accessToken, refreshToken };
};

// luu refreshtoken
const updateRefreshToken = (username, refreshToken) => {
  users = users.map((user) => {
    if (user.username === username)
      return {
        ...user,
        refreshToken,
      };
    return user;
  });
};

// route: user dang nhap
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = users.find((user) => user.username === username);

  if (!user) return res.sendStatus(401);

  const tokens = generateTokens(user);
  updateRefreshToken(username, tokens.refreshToken);

  console.log(users);

  res.json(tokens);
});

// xu ly khi accesstoken bi het han
app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = users.find((user) => user.refreshToken === refreshToken);

  if (!user) return res.sendStatus(403);

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // tao cap access & refresh token moi
    const tokens = generateTokens(user);
    updateRefreshToken(user.username, tokens.refreshToken);

    res.json(tokens);
  } catch (error) {
    console.log("Loi: ", error);
    res.sendStatus(403);
  }
});

// xoa refresh.token khi user logout
app.delete("/logout", verifyToken, (req, res) => {
  const user = users.find((user) => user.id === req.userId);
  updateRefreshToken(user.username, null);
  // console.log(users);

  res.sendStatus(204);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
