const router = require('express').Router();
const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');

const {
  updateUserInfoValidator,
} = require('../validators/validators');

router.get('/me', getUser);
router.patch('/me', updateUserInfoValidator, updateUserInfo);

module.exports = router;
