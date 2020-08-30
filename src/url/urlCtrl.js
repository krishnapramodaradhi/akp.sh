const { nanoid } = require('nanoid');
const { resolve } = require('path');

const Url = require('./urlModel');
const { validationResult } = require('express-validator');
const { handleError } = require('../utils');

exports.createShortUrl = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw handleError(400, 'Validation Failure', errors.array());
    }
    const { url, slug } = req.body;
    const data = await Url.findOne({ slug });
    if (data && slug === data.slug) {
      throw handleError(400, 'Slug in use');
    }
    const newUrl = await new Url({
      url,
      slug: slug || nanoid(7).toLowerCase(),
    }).save();
    res.json(newUrl);
  } catch (error) {
    next(error);
  }
};

exports.redirectLink = async function (req, res, next) {
  try {
    const url = await Url.findOne({ slug: req.params.id });
    if (!url) {
      return res.sendFile(
        resolve(`${__dirname}`, '..', '..', 'public/404.html')
      );
    }
    res.redirect(url.url);
  } catch (error) {
    next(error);
  }
};
