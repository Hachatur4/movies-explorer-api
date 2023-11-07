const router = require('express').Router();
const {
  getMovies,
  deleteMovies,
  createMovies,
} = require('../controllers/movies');

const {
  createMovieValidator,
} = require('../validators/validators');

router.get('/', getMovies);
router.post('/', createMovieValidator, createMovies);
router.delete('/:_id', deleteMovies);

module.exports = router;
