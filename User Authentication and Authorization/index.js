const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8000;
require("dotenv").config();
const app = express();
require("./db");
const User = require("./MODELS/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


function autnenticateToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    const error = new Error("Token Not Found");
    next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userid = decoded.id;
    req.id = userid
    next()
  } catch (err) {
    next(err);
  }
}

app.get("/", (req, res) => {
  res.json({ message: "The API IS WORKING" });
});

// register
app.post("/register", async (req, res, next) => {
  try {
    const { email, password, age, name, gender } = req.body;
    const exsitingUser = await User.findOne({ email });

    if (exsitingUser) {
      //       return res.status(409).json("Email Already exists");
      const error = new Error("Email Already exists");
      next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("salt", salt);
    console.log("hashedPassword", hashedPassword);

    const newUser = new User({
      name,
      password: hashedPassword,
      email,
      age,
      gender,
    });

    await newUser.save();
    res.status(201).json({
      message: "User Registered Successfully!",
    });
  } catch (err) {
    //     res.status(500).json({ message: err.message });
    next(err);
  }
});

// login
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exsitingUser = await User.findOne({ email });

    if (!exsitingUser) {
      //       return res.status(401).json({ message: "Invalid credentials" });
      const error = new Error("Invalid credentials");
      next(error);
    }
    const userPasswordCorrect = await bcrypt.compare(
      password,
      exsitingUser.password
    );

    if (!userPasswordCorrect) {
      //       return res.status(401).json({ message: "Invalid Credentials!" });
      const error = new Error("Invalid credentials");
      next(error);
    }

    const accesstoken = jwt.sign(
      { id: exsitingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );

    const refreshToken = jwt.sign(
      { id: exsitingUser._id },
      process.env.JWT_REFRESH_SECRET_KEY
    );
    exsitingUser.refreshToken = refreshToken;
    await exsitingUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refresh_token",
    });

    res.status(200).json({
      accesstoken,
      refreshToken,
      message: "User logged in Successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/getuserProfile", autnenticateToken, async (req, res, next) => {
  const id = req.id
  const user = await User.findById(id);

  //     if you hide password
  user.password = undefined;
  res.status(200).json({ user });
});

app.get("/refresh_token", async (req, res, next) => {
  const token = req.cookies.refreshToken;

  //   res.send(token)
  if (!token) {
    const error = new Error("Token not Found");
    next(error);
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
    if (err) {
      const error = new Error("Invalid Token");
      next(error);
    }

    const id = decoded.id;
    const exsitingUser = await User.findById(id);
    if (!exsitingUser || token !== exsitingUser.refreshToken) {
      const error = new Error("Invalid Token");
      next(error);
    };

    const accesstoken = jwt.sign({ id: exsitingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });

    const refreshToken = jwt.sign({ id: exsitingUser._id }, process.env.JWT_REFRESH_SECRET_KEY);
    exsitingUser.refreshToken = refreshToken;
    await exsitingUser.save();
    res.cookie("refreshToken", refreshToken, { httpOnly: true, path: "/refresh_token", });

    res.status(200).json({
      accesstoken,
      refreshToken,
      message: "Token Refreshed Successfully!",
    });
  }
  );
});

// ERROR HANDLING MIDLEWARE
app.use((err, req, res, next) => {
  console.log("error middleware called: ", err);
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`The port runuing on +${PORT}`);
});
