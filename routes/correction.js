const { CorrectionController: { createCorrection, getOneCorrection, getUserCorrection, findFilter, responseCorrection, seeAllRequestIn } } = require('../controllers'),
  { auth: { matchPin, isStaff } } = require('../middlewares')
  Route = require('express').Router();

Route.get('/', getUserCorrection); //*
Route.get('/search', findFilter); //*
Route.post('/inreq', matchPin, seeAllRequestIn); //*
Route.get('/:id', isStaff, getOneCorrection); //*
Route.post('/', createCorrection); //*
Route.patch('/:id/:res', matchPin, responseCorrection); //*


module.exports = Route;