const { date } = require('../helpers'),
  { auth } = require('../middlewares'),
  Route = require('express').Router();

Route.get('/', auth.authentication, (req, res,next) => res.status(200).json({ time: date() }))

module.exports = Route;