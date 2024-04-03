const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!!!!");
});

app.get("/about", (req, res) => {
  res.status(200).send("Hello World!  About");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// app.use("*", (req, res, next) => {
//   res.status(404).send("Sorry can't find that!");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
