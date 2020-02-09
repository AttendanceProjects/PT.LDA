const Route = require('express').Router(),
  { auth: { authorization } } = require('../middlewares'),
  { AttendanceController: {
      createStartAtt,
      getAttUser,
      updateEndAtt,
      getDailyHistory,
      createAttOffline,
      updateLocation,
      revisiLocation,
      getAllAttendance,
      checkAvaiable,
      getOneUserAttendance,
      findAttById,
      searchFilter,
      deleteCauseFail
    } } = require('../controllers')

// Route.get('/admin', isAdmin, getAllAttendance); // soon
  
Route.get('/', getAttUser); // *
Route.get('/history', getOneUserAttendance); // *
Route.get('/daily', getDailyHistory); // *
Route.get('/:id', authorization, findAttById); //*
Route.get('/search/by', searchFilter); //*
Route.get('/check/:id', checkAvaiable);
Route.post('/', createStartAtt); // *
Route.post('/offline', createAttOffline); 
Route.patch('/location/:os/:type/:id', updateLocation); // *
Route.patch('/revisi/:os/:type/:id', revisiLocation); // *
Route.patch('/:id', updateEndAtt); // *
Route.delete('/fail/:id', deleteCauseFail); // *

// Route.post('/upload', multer.single( 'image' ), sendUploadToGCS, uploadingImage); // *

module.exports = Route;