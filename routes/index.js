const Route = require('express').Router();

Route.use('/users', require('./user'));
Route.use('/attendance', require('./attendance'));
Route.use('/company', require('./company'));
Route.use('/time', require('./time'));

module.exports = Route;