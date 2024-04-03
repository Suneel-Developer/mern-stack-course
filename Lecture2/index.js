const express = require("express");
const userRoutes = require("./controllers/userRoutes");
const PORT = 8000;
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());


// If we allow some aspicific port then we use that origins
// cors - localhost:300, localhost: 3001,
// const allowedOrigins = ["https://localhost:3000", "http://localhost:3001"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("Making CORS request from " + origin);
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       else return callback(new Error("Not allowed by CORS"));
//     },
//   })
// );



app.use(cors(true)); // allow all origins
//
app.use("/userapis", userRoutes);
app.get("/", (req, res) => {
  res.send({
    message: "The API is working!!",
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
