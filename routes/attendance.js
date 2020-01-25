const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { authentication } = auth,
  { AttendanceController } = require('../controllers'),
  { createStartAtt, getAttUser, updateEndAtt, getDailyHistory, uploadingImage, updateLocation, deleteCauseFail, revisiLocation, getAllAttendance, getOneUserAttendance } = AttendanceController,
  { sendUploadToGCS, multer } = require('../helpers/images')

// Route.get('/admin', authentication, isAdmin, getAllAttendance); // soon
  
Route.get('/', authentication, getAttUser); // *
Route.get('/history', authentication, getOneUserAttendance);
Route.get('/daily', authentication, getDailyHistory); // *
Route.post('/', authentication, createStartAtt); // *
Route.post('/upload', authentication, multer.single( 'image' ), sendUploadToGCS, uploadingImage); // *
Route.post('/location/:os/:type/:id', authentication, updateLocation); // *
Route.post('/revisi/:os/:type/:id', authentication, revisiLocation); // *
Route.post('/:id', authentication, updateEndAtt); // *
Route.delete('/fail/:id', authentication, deleteCauseFail); // *
// Route.post('/issues/:id', authentication, updateTruthLocation);


module.exports = Route;