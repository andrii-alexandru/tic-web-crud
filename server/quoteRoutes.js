const express = require("express");
const authenticateUser = require("./authMiddleware");

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

  return router;
};

module.exports = createQuoteRoute;
