const Route = require('express').Router(),
  { auth: { isMaster } } = require('../middlewares'),
  { CompanyController: { createCompany, getInfoCompnay } } = require('../controllers')

Route.get('/', getInfoCompnay);
Route.post('/', isMaster, createCompany);

module.exports = Route;