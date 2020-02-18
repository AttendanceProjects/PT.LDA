const Route = require('express').Router(),
  { TokenController: { createToken, getAllTokenForAdmin, getOneTokenForPush } } = require('../controllers'),
  { auth: { isStaff } } = require('../middlewares')

Route.post('/', createToken); //all user
Route.get('/', isStaff, getAllTokenForAdmin); //admin only
Route.get('/:id', isStaff, getOneTokenForPush); //admin only

module.exports = Route;