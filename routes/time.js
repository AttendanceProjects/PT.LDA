const { date } = require('../helpers'),
  Route = require('express').Router();

Route.get('/', (req, res, next) => res.status(200).json({ time: date().toLocaleTimeString() }))

module.exports = Route;