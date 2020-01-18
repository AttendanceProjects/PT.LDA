const Route = require('express').Router();

Route.use('/users', require('./user'));
Route.use('/attendance', require('./attendance'));
Route.use('/history', require('./history'));

module.exports = Route;