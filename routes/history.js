const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { authentication } = auth ,
  { HistoryController } = require('../controllers'),
  { GetUserHistory } = HistoryController

Route.get('/', authentication, GetUserHistory);

module.exports = Route;