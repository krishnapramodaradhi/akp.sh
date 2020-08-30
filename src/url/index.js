const router = require('express').Router();
const { check } = require('express-validator');

const { createShortUrl, redirectLink } = require('./urlCtrl');

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

router.get('/:id', redirectLink);

module.exports = router;
