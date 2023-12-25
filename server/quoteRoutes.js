const express = require("express");
const authenticateUser = require("./authMiddleware");
const faker = require("faker");
const { auth } = require("firebase-admin");

const createQuoteRoute = (admin) => {
  const router = express.Router();
  const quotesCollection = admin.firestore().collection("quotes");

  // Endpoint for creating a quote
  router.post("/create-quote", authenticateUser, async (req, res) => {
    try {
      const quoteData = req.body;
      const userId = req.user.uid;
      const userEmail = req.user.email;

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

  // Endpoint for editing a quote
  router.put("/edit-quote/:id", authenticateUser, async (req, res) => {
    try {
      const quoteId = req.params.id;
      const quoteData = req.body;

      const quoteRef = quotesCollection.doc(quoteId);
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

  // Endpoint for deleting a quote
  router.delete("/delete-quote/:id", authenticateUser, async (req, res) => {
    try {
      const quoteId = req.params.id;

      const quoteRef = quotesCollection.doc(quoteId);
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

  router.post("/generate-random-quotes", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.uid;

      const authorsCollection = admin.firestore().collection("authors");
      const authors = await authorsCollection.get();

      const quotesCollection = admin.firestore().collection("quotes");

      const randomQuotes = Array.from({ length: 10 }, () => {
        const randomAuthor =
          authors.docs[Math.floor(Math.random() * authors.docs.length)].id;

        return {
          author: randomAuthor,
          body: faker.lorem.paragraph(),
          bookReference: faker.lorem.words(),
          significant: faker.datatype.boolean(),
          userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
      });

      await Promise.all(
        randomQuotes.map(async (quote) => {
          await quotesCollection.add({
            ...quote,
            userId,
          });
        })
      );

      res.status(200).json({ message: "Random quotes generated successfully" });
    } catch (error) {
      console.error("Error generating random quotes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};

module.exports = createQuoteRoute;
