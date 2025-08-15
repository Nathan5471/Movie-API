import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/add", authenticate, async (req, res) => {
  const { title, description, releaseYear, tvdbId } = req.body;
  if (!title || !description || !releaseYear || !tvdbId) {
    return res.status(400).json({ error: "All fields are required." });
  }
  await addMovie(req, res);
});

router.get("/all", getAllMovies);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Movie ID is required." });
  }
  await getMovieById(req, res);
});

export default router;
