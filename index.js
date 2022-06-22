require("dotenv").config(); // Load vars from .env file
const express = require("express");
const routes = require("./routes/index");
const db = require("./utils/db");

const port = 8080;
const app = express();

// Routes
app.get("/", function (_, res) {
  console.log("Accessing /");
  res.json({ key: "value" });
});

app.get("/countries", routes.getCountries);
app.get("/salesrep", routes.getSalesrep);
app.get("/optimal", routes.getOptimal);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

/**
 * Graceful shutdown
 */
process.on("SIGTERM", function() {
  console.log("SIGTERM signal received: closing HTTP server");

  db.closeDB()
    .then(function () {
      app.close(function() {
        console.log("HTTP server closed");
      });
    })
    .catch(function (err) {
      console.error(err);
    });
});
