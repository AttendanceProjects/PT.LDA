const Route = require('express').Router(),
  { auth } = require('../middlewares'),
  { CompanyController } = require('../controllers'),
  { authentication, isMaster } = auth,
  { createCompany, getInfoCompnay } = CompanyController

Route.get('/', authentication, getInfoCompnay);
Route.post('/', authentication, isMaster, createCompany);

module.exports = Route;