const express = require("express");
const router = express.Router();
const fs = require("fs"); // maniplute the data file // fs stands for file system
const path = require("path"); //  get the directory name of the current script

const fileDataPath = path.join(__dirname, "../UserData.json"); // get the full address of UserData.json in the project folder

const readdatafromFile = () => {
  const data = fs.readFileSync(fileDataPath);
  return JSON.parse(data);
};

const writedatatoFile = (data) => {
  fs.writeFileSync(fileDataPath, JSON.stringify(data, null, 2));
};

// Get All Users
router.get("/users", (req, res) => {
  const users = readdatafromFile();
  res.send(users);
});

// Get Specific User
router.get("/users/:id", (req, res) => {
  const users = readdatafromFile();
  const userId = req.params.id;
  const user = users.find((user) => user.id == userId);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send({
      error: "user not find",
    });
  }
});

// Post method // add or send  data/user to database
router.post("/users", (req, res) => {
  const user = req.body;
  //   console.log("User is :", user);

  const users = readdatafromFile();

  user.id = new Date().getTime();

  users.push(user);
  writedatatoFile(users);
  //   console.log("user", user);
  res.send(users);
});

// Edit/ update user
router.put("/users/:id", (req, res) => {
  const users = readdatafromFile();
  const userId = req.params.id;

  const updateUser = req.body;

  const userIndex = users.findIndex((user) => user.id === parseInt(userId));

  if (userIndex != -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updateUser,
    };

    writedatatoFile(users);
    res.send(users[userIndex]);
  } else {
    res.status(404).send({
      error: "user not find",
    });
  }
});

// delete any user using ID
router.delete("/users/:id", (req, res) => {
  const users = readdatafromFile();
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === parseInt(userId));

  if (userIndex == -1) {
    return res.status(404).send({
      error: "User Not Found",
    });
  }

  users.splice(userIndex, 1);
  writedatatoFile(users);
  res.send({
    message: `User with id ${userId} has been deleted!`,
  });
});

router.get("/test", (req, res) => {
  res.send({
    message: "Test is working!",
    path: fileDataPath,
  });
});

module.exports = router;
