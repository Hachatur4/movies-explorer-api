const mongoose = require('mongoose');

const card = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  image: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  trailerLink: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  thumbnail: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'owner',
    required: true,
  },
  movieId: {
    type: Number,
    ref: 'owner',
    required: true,
  },
  nameRU: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  nameEN: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', card);
