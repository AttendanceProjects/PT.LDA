const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { authentication } = auth,
  { AttendanceController } = require('../controllers'),
  { createStartAtt, getAttUser, updateEndAtt, uploadingImage } = AttendanceController,
  { sendUploadToGCS, multer } = require('../helpers/images')


Route.get('/', authentication, getAttUser);
Route.post('/', authentication, createStartAtt);
Route.post('/upload', multer.single( 'image' ), sendUploadToGCS, uploadingImage);
Route.patch('/:id', authentication, updateEndAtt);


module.exports = Route;