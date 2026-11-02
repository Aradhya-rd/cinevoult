const express = require('express');
const router = express.Router();
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');

// Routes for /api/movies
router.post('/', createMovie);
router.get('/', getAllMovies);

// Routes for /api/movies/:id
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
