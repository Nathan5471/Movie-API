import Movie from "../models/movie.js";

export const addMovie = async (req, res) => {
  const { title, description, releaseYear, tvdbId } = req.body;
  try {
    const newMovie = new Movie({
      title,
      description,
      releaseYear,
      tvdbId,
      userId: req.user._id,
    });
    await newMovie.save();
    return res.status(201).json({ id: newMovie._id, title: newMovie.title });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
