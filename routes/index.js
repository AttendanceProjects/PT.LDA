const Route = require('express').Router();

Route.use('/users', require('./user'));

module.exports = Route;