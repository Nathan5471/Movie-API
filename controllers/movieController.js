import Movie from "../models/movie.js";

export const addMovie = async (req, res) => {
  const { title, description, releaseYear, tvdbId } = req.body;
  try {
    const existingTvdbId = await Movie.findOne({ tvdbId });
    if (existingTvdbId) {
      return res
        .status(400)
        .json({ error: "Movie with this TVDB ID already exists." });
    }
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

export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseYear, tvdbId } = req.body;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    if (movie.userId !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized." });
    }
    if (title) movie.title = title;
    if (description) movie.description = description;
    if (releaseYear) movie.releaseYear = releaseYear;
    if (tvdbId) {
      const existingTvdbId = await Movie.findOne({ tvdbId });
      if (existingTvdbId) {
        return res
          .status(400)
          .json({ error: "Movie with this TVDB ID already exists." });
      }
      movie.tvdbId = tvdbId;
    }
    await movie.save();
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    if (movie.userId !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized." });
    }
    await movie.remove();
    return res.status(200).json({ message: "Movie deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const rateMovie = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    movie.ratingsInformation.ratings.push({
      rating,
      userId: req.user._id,
    });
    movie.ratingsInformation.averageRating =
      movie.ratingsInformation.ratings.reduce(
        (acc, curr) => acc + curr.rating,
        0
      ) / movie.ratingsInformation.ratings.length;
    await movie.save();
    return res.status(200).json({
      averageRating: movie.ratingsInformation.averageRating,
      totalRatings: movie.ratingsInformation.ratings.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getMovieRating = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    if (req.user) {
      const userRating = movie.ratingsInformation.ratings.find(
        (rating) => rating.userId === req.user._id
      );
      if (userRating) {
        return res.status(200).json({
          averageRating: movie.ratingsInformation.averageRating,
          totalRatings: movie.ratingsInformation.ratings.length,
          userRating: userRating.rating,
        });
      }
    }
    return res.status(200).json({
      averageRating: movie.ratingsInformation.averageRating,
      totalRatings: movie.ratingsInformation.ratings.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const removeMovieRating = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    movie.ratingsInformation.ratings = movie.ratingsInformation.ratings.filter(
      (rating) => rating.userId !== req.user._id
    );
    movie.ratingsInformation.averageRating =
      movie.ratingsInformation.ratings.reduce(
        (acc, curr) => acc + curr.rating,
        0
      ) / movie.ratingsInformation.ratings.length;
    await movie.save();
    return res.status(200).json({ message: "Rating removed successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
