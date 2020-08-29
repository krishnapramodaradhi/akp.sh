const router = require('express').Router();
const { check } = require('express-validator');

const { createShortUrl } = require('./urlCtrl');

router.post(
  '/url',
  [
    check('url').isURL(),
    check('slug')
      .trim()
      .optional()
      .matches(/^[\w\-]*$/i),
  ],
  createShortUrl
);

module.exports = router;
