const { Router } = require('express'),
  { auth } = require('../middlewares'),
  { authentication } = auth ,
  { HistoryController } = require('../controllers'),
  { GetUserHistory } = HistoryController

Router().get('/', authentication, GetUserHistory);

module.exports = Router();