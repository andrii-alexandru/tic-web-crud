const express = require("express");
const authenticateUser = require("./authMiddleware");
const faker = require("faker");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createAuthorRoute = (admin) => {
  const router = express.Router();
  const authorsCollection = admin.firestore().collection("authors");

  router.post("/create-author", authenticateUser, async (req, res) => {
    try {
      const authorData = req.body;
      const userId = req.user.uid;
      const userEmail = req.user.email;

      authorData.birthDate = admin.firestore.Timestamp.fromDate(
        new Date(authorData.birthDate)
      );

      const authorRef = await authorsCollection.add({
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

      authorData.birthDate = admin.firestore.Timestamp.fromDate(
        new Date(authorData.birthDate)
      );

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

  const uploadFolder = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Specify the folder where uploaded files will be stored
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  const upload = multer({ storage: storage });

  router.post(
    "/upload-profile-picture",
    authenticateUser,
    upload.single("file"),
    (req, res) => {
      try {
        const file = req.file;
        if (!file) {
          return res.status(400).send("No file uploaded.");
        }

        path.join(__dirname, "uploads", file.filename);

        res.status(200).send({
          message: "File uploaded successfully.",
          imageUrl: `http://localhost:${port}/${file.filename}`,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  return router;
};

module.exports = createAuthorRoute;
