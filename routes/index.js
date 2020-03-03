const Route = require('express').Router(),
  { auth: { authentication } } = require('../middlewares')

Route.use('/users', require('./user'));

Route.use('/upload', require('./upload'));
Route.use( authentication );
Route.use('/attendance', require('./attendance'));
Route.use('/company', require('./company'));
Route.use('/correction', require('./correction'));
Route.use('/time', require('./time'));
Route.use('/token', require('./token'));

module.exports = Route;