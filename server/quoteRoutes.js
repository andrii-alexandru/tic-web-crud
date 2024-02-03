const express = require("express");
const authenticateUser = require("./authMiddleware");
const faker = require("faker");
const { auth } = require("firebase-admin");

const createQuoteRoute = (admin) => {
  const router = express.Router();
  // const quotesCollection = admin.firestore().collection("quotes");
  const authorsCollection = admin.firestore().collection("authors");

  // Endpoint for creating a quote
  router.post("/create-quote", authenticateUser, async (req, res) => {
    try {
      const quoteData = req.body;
      const userId = req.user.uid;
      const userEmail = req.user.email;

      if (!quoteData.authorId) {
        return res
          .status(400)
          .json({ message: "Author ID is required for creating a quote" });
      }

      // Create a reference to the author's quotes collection
      const quotesCollection = admin
        .firestore()
        .collection(`authors/${quoteData.authorId}/quotes`);

      delete quoteData.authorId;

      // Add the new quote to the author's quotes collection
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
  router.put("/edit-quote", authenticateUser, async (req, res) => {
    try {
      const quoteData = req.body;
      const quoteId = quoteData.id;

      if (!quoteData.authorId) {
        return res
          .status(400)
          .json({ message: "Author ID is required for creating a quote" });
      }

      const quotesCollection = admin
        .firestore()
        .collection(`authors/${quoteData.authorId}/quotes`);

      const quoteRef = quotesCollection.doc(quoteId);
      const quoteDoc = await quoteRef.get();

      if (!quoteDoc.exists) {
        res.status(404).json({ message: "Quote not found" });
        return;
      }

      delete quoteData.id;
      delete quoteData.authorId;

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
  router.delete(
    "/delete-quote/:quoteId/:authorId",
    authenticateUser,
    async (req, res) => {
      try {
        const quoteId = req.params.quoteId;
        const authorId = req.params.authorId;

        const quotesCollection = admin
          .firestore()
          .collection(`authors/${authorId}/quotes`);

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
    }
  );

  router.post("/generate-random-quotes", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.uid;
      const userEmail = req.user.email;

      const authorsCollection = admin.firestore().collection("authors");
      const authors = await authorsCollection.get();

      // if there are no authors, return an error
      if (authors.empty) {
        return res.status(404).json({ message: "No authors found" });
      }

      for (let i = 0; i < 10; i++) {
        const randomAuthor =
          authors.docs[Math.floor(Math.random() * authors.docs.length)];

        const quotesCollection = admin
          .firestore()
          .collection(`authors/${randomAuthor.id}/quotes`);

        await quotesCollection.add({
          body: faker.lorem.paragraph(),
          bookReference: faker.lorem.words(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          favorite: [],
          significant: faker.datatype.boolean(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          userId,
          userEmail,
        });
      }

      res.status(200).json({ message: "Random quotes generated successfully" });
    } catch (error) {
      console.error("Error generating random quotes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.put("/update-favorite", authenticateUser, async (req, res) => {
    try {
      const quoteId = req.body.quoteId;
      const authorId = req.body.authorId;
      const isFavorite = req.body.isFavorite;

      const userId = req.user.uid;
      const quotesCollection = admin
        .firestore()
        .collection(`authors/${authorId}/quotes`);
      const quoteRef = quotesCollection.doc(quoteId);

      const doc = await quoteRef.get();
      if (!doc.exists) {
        res
          .status(404)
          .json({ message: "Could not find a quote with this reference: " + quoteId + " and authorId: " + authorId});
        return;
      }

      const existingFavorite = doc.data().favorite || [];
      let updatedFavorite;
      if (isFavorite) {
        // Add the user to the favorite list if they are not already there
        updatedFavorite = existingFavorite.includes(userId)
          ? existingFavorite
          : [...existingFavorite, userId];
      } else {
        // Remove the user from the favorite list
        updatedFavorite = existingFavorite.filter((id) => id !== userId);
      }

      await quoteRef.update({
        favorite: updatedFavorite,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: "Favorite status updated." });
    } catch (error) {
      console.error("Error updating quote:", error);
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = createQuoteRoute;
