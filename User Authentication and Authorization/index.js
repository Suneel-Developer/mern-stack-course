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

app.use(bodyParser.json());
app.use(cors());

function autnenticateToken(req, res, next) {
  const token = req.headers.authorization;
  const { id } = req.body;

  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (id && decoded.id !== id) {
      return res.status(401).json({ message: "Auth Error" });
    }
    req.id = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid Token" });
  }
}

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

// register
app.post("/register", async (req, res) => {
  try {
    const { email, password, age, name, gender } = req.body;
    const exsitingUser = await User.findOne({ email });

    if (exsitingUser) {
      return res.status(409).json("Email Already exists");
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
    res.status(500).json({ message: err.message });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exsitingUser = await User.findOne({ email });

    if (!exsitingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userPasswordCorrect = await bcrypt.compare(
      password,
      exsitingUser.password
    );

    if (!userPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const tokens = jwt.sign(
      { id: exsitingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ tokens, message: "User logged in Successfully!" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/getuserProfile", autnenticateToken, async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);

  //     if you hide password
  user.password = undefined;
  res.status(200).json({ user });
});

app.listen(PORT, () => {
  console.log(`The port runuing on +${PORT}`);
});
