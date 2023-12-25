const express = require("express");
const authenticateUser = require("./authMiddleware");
const faker = require("faker");

const createAuthorRoute = (admin) => {
  const router = express.Router();
  const authorsCollection = admin.firestore().collection("authors");

  // Endpoint for creating a author
  router.post("/create-author", authenticateUser, async (req, res) => {
    try {
      const authorData = req.body;
      const userId = req.user.uid;
      const userEmail = req.user.email;

      //format birthDate to timestamp
      authorData.birthDate = admin.firestore.Timestamp.fromDate(
        new Date(authorData.birthDate)
      );

      await authorsCollection.add({
        ...authorData,
        userId,
        userEmail,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: "author created successfully" });
    } catch (error) {
      console.error("Error creating author:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Endpoint for editing a author
  router.put("/edit-author/:id", authenticateUser, async (req, res) => {
    try {
      const authorId = req.params.id;
      const authorData = req.body;

      const authorRef = authorsCollection.doc(authorId);
      const doc = await authorRef.get();

      if (!doc.exists) {
        res.status(404).json({ message: "author not found" });
        return;
      }

      await authorRef.update({
        ...authorData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: "author updated successfully" });
    } catch (error) {
      console.error("Error updating author:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Endpoint for deleting a author
  router.delete("/delete-author/:id", authenticateUser, async (req, res) => {
    try {
      const authorId = req.params.id;

      const authorRef = authorsCollection.doc(authorId);
      const doc = await authorRef.get();

      if (!doc.exists) {
        res.status(404).json({ message: "author not found" });
        return;
      }

      await authorRef.delete();

      res.status(200).json({ message: "author deleted successfully" });
    } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post(
    "/generate-random-authors",
    authenticateUser,
    async (req, res) => {
      try {
        const userId = req.user.uid;

        const randomAuthors = Array.from({ length: 10 }, () => ({
          name: faker.name.findName(),
          birthDate: faker.date.past(),
          nationality: faker.address.country(),
          userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }));

        await Promise.all(
          randomAuthors.map(async (author) => {
            await authorsCollection.add(author);
          })
        );

        res
          .status(200)
          .json({ message: "Random authors generated successfully" });
      } catch (error) {
        console.error("Error generating random authors:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );

  return router;
};

module.exports = createAuthorRoute;