const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const createQuoteRoute = require("./quoteRoutes");
const createAuthorRoute = require("./authorRoutes");
const serviceAccount = require("./tic-web-crud-9d48e-firebase-adminsdk-gj9ov-f13848edeb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

const authorRoutes = createAuthorRoute(admin);
app.use("/api", authorRoutes);

const quoteRoutes = createQuoteRoute(admin);
app.use("/api", quoteRoutes);