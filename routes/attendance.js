const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { authentication } = auth,
  { AttendanceController } = require('../controllers'),
  { createStartAtt, getAttUser, updateEndAtt, uploadingImage, updateLocation, deleteCauseFail } = AttendanceController,
  { sendUploadToGCS, multer } = require('../helpers/images')


Route.get('/', authentication, getAttUser);
Route.post('/', authentication, createStartAtt);
Route.post('/upload', authentication, multer.single( 'image' ), sendUploadToGCS, uploadingImage);
Route.post('/location/:os/:type/:id', authentication, updateLocation);
Route.post('/:id', authentication, updateEndAtt);
Route.delete('/fail/:id', authentication, deleteCauseFail);
// Route.post('/issues/:id', authentication, updateTruthLocation);


module.exports = Route;