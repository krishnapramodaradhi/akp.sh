const { Schema, model } = require('mongoose');

module.exports = model(
  'urls',
  new Schema(
    {
      url: { type: String, required: true },
      slug: { type: String, unique: true },
    },
    { timestamps: true }
  )
);
