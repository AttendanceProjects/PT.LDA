const { CorrectionController: { createCorrection, getUserCorrection, findFilter, responseCorrection, seeAllRequestIn } } = require('../controllers'),
  { auth: { acceptCorrection } } = require('../middlewares')
  Route = require('express').Router();

Route.get('/', getUserCorrection);
Route.get('/search', findFilter);
Route.get('/inreq', acceptCorrection, seeAllRequestIn);
Route.post('/', createCorrection);
Route.patch('/:id/:res', acceptCorrection, responseCorrection);


module.exports = Route;