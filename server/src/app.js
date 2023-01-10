const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json()); //(Middleware) parse any incoming json from the body of request
app.use(express.static(path.join(__dirname, "..", "public"))); //Serving static file using express (load 'public' folder)

app.use("/v1", api);

app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
