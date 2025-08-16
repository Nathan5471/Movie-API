import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
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

router.put("/edit/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseYear, tvdbId } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Movie ID is required." });
  }
  if (!title && !description && !releaseYear && !tvdbId) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update." });
  }
  await updateMovie(req, res);
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Movie ID is required." });
  }
  await deleteMovie(req, res);
});

export default router;
