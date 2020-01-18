const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { authentication } = auth,
  { AttendanceController } = require('../controllers'),
  { createStartAtt, getAttUser, updateEndAtt } = AttendanceController

Route.get('/', authentication, getAttUser);
Route.post('/', authentication, createStartAtt);
Route.patch('/:id', authentication, updateEndAtt);


module.exports = Route;