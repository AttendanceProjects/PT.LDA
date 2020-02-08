const { CorrectionController } = require('../controllers'),
  { auth } = require('../middlewares'),
  {
    createCorrection,
    getUserCorrection,
    findFilter,
    responseCorrection,
    seeAllRequestIn
  } = CorrectionController,
  { authentication, acceptCorrection } = auth,
  Route = require('express').Router();

Route.get('/', authentication, getUserCorrection);
Route.get('/search', authentication, findFilter);
Route.get('/inreq', authentication, acceptCorrection, seeAllRequestIn);
Route.post('/:id', authentication, createCorrection);
Route.patch('/:id/:res', authentication, acceptCorrection, responseCorrection);


module.exports = Route;