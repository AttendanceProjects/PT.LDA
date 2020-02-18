const Route = require('express').Router(),
  { TokenController: { createToken, pushAllUserForAdmin, pushOneUserForAdmin } } = require('../controllers'),
  { auth: { isStaff } } = require('../middlewares')

Route.post('/', createToken); //all user
Route.post('/all', isStaff, pushAllUserForAdmin); //admin only
Route.post('/user/:id', isStaff, pushOneUserForAdmin); //admin only

module.exports = Route;