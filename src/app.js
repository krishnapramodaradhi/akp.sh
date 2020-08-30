require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const csp = require('helmet-csp');
const { connect } = require('mongoose');

const urlRoutes = require('./url');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(
  csp({
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [`'self'`],
      connectSrc: [`http:`, `https:`],
      styleSrc: [`'self'`, `fonts.googleapis.com`],
      fontSrc: [`fonts.gstatic.com`],
      imgSrc: [`'self'`, `i.imgur.com`],
    },
  })
);
app.use((req, res, next) => {
  res.header('Set-Cookie', 'Secure;SameSite=None');
  next();
});
app.use(express.json());
app.use(express.static('public'));

app.use(urlRoutes);

app.use((req, res, next) => {
  const error = new Error('Page not found');
  error.statusCode = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const { statusCode = 500, message = 'An error occured', data } = error;
  res.status(statusCode).json({ statusCode, message, data });
});

(async function () {
  try {
    const { connection } = await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`connected to db: ${connection.name}`);
    app.listen(port, () =>
      console.log(`Listening on http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
