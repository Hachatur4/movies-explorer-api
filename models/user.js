const mongoose = require('mongoose');
const validator = require('validator');

const userCard = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Имя пользователя не указано'],
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Некорректный email'],
    unique: true,
    required: [true, 'Не указан email'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Не указан пароль'],
  },
});

module.exports = mongoose.model('user', userCard);
