const Movies = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequesError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => {
      return res.status(200).send(movies);
    })
    .catch((err) => next(err));
};

module.exports.deleteMovies = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку фильма.');
      }
      return Movies.deleteOne(movie, { new: true })
        .then((result) => {
          return res.status(200).send(movie);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequesError('Фильм по указанному id не найдена.'));
      }
      next(err);
    });
};

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ movie }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании карточки фильма.'));
      }
      next(err);
    });
};
