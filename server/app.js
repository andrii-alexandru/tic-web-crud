const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var admin = require("firebase-admin");
var serviceAccount = require("./tic-web-crud-9d48e-firebase-adminsdk-gj9ov-f13848edeb.json");
const authenticateUser = require("./authMiddleware");

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

// Endpoint for creating a quote
app.post("/create-quote", authenticateUser, async (req, res) => {
  try {
    const quoteData = req.body;

    const userId = req.user.uid;
    const userEmail = req.user.email;

    const quotesCollection = admin.firestore().collection("quotes");

    await quotesCollection.add({
      ...quoteData,
      userId,
      userEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Quote created successfully" });
  } catch (error) {
    console.error("Error creating quote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint for editing a quote
app.put("/edit-quote/:id", authenticateUser, async (req, res) => {
  try {
    const quoteId = req.params.id;
    const quoteData = req.body;

    const quoteRef = admin.firestore().collection("quotes").doc(quoteId);
    const doc = await quoteRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "Quote not found" });
      return;
    }

    await quoteRef.update({
      ...quoteData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Quote updated successfully" });
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete-quote/:id", authenticateUser, async (req, res) => {
  try {
    const quoteId = req.params.id;

    const quoteRef = admin.firestore().collection("quotes").doc(quoteId);
    const doc = await quoteRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "Quote not found" });
      return;
    }

    await quoteRef.delete();

    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete-author/:id", authenticateUser, async (req, res) => {
  try {
    const authorId = req.params.id;

    const authorRef = admin.firestore().collection("authors").doc(authorId);
    const doc = await authorRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    await authorRef.delete();

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
