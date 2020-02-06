const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { authentication, authorization } = auth,
  { AttendanceController } = require('../controllers'),
  { createStartAtt, getAttUser, updateEndAtt, getDailyHistory, uploadingImage, updateLocation, deleteCauseFail, revisiLocation, getAllAttendance, checkAvaiable, getOneUserAttendance, findAttById, searchFilter } = AttendanceController,
  { sendUploadToGCS, multer } = require('../helpers/images')

// Route.get('/admin', authentication, isAdmin, getAllAttendance); // soon
  
Route.get('/', authentication, getAttUser); // *
Route.get('/history', authentication, getOneUserAttendance); // *
Route.get('/daily', authentication, getDailyHistory); // *
Route.get('/:id', authentication, authorization, findAttById); //*
Route.get('/search/by', authentication, searchFilter); //*
Route.get('/check/:id', authentication, checkAvaiable);
Route.post('/', authentication, createStartAtt); // *
Route.post('/upload', authentication, multer.single( 'image' ), sendUploadToGCS, uploadingImage); // *
Route.patch('/location/:os/:type/:id', authentication, updateLocation); // *
Route.patch('/revisi/:os/:type/:id', authentication, revisiLocation); // *
Route.patch('/:id', authentication, updateEndAtt); // *
Route.delete('/fail/:id', authentication, deleteCauseFail); // *
// Route.post('/issues/:id', authentication, updateTruthLocation);


module.exports = Route;