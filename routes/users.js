const router = require('express').Router();
const { celebrate } = require('celebrate');
const { idValidation, updateUserValidation, imageUrlValidation } = require('../middlewares/validation');
const {
  getUsers, getUser, updateAvatar, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', celebrate(idValidation), getUser);
router.patch('/me', celebrate(updateUserValidation), updateUser);
router.patch('/me/avatar', celebrate(imageUrlValidation), updateAvatar);

module.exports = router;
