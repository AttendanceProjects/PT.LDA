const { jwt } = require('../helpers'),
  { decodeToken } = jwt,
  { User, Attendance, Company } = require('../models'),
  mongoose = require('mongoose');

module.exports = {
  authentication ( req, res, next ) {
    try {
      if(req.headers.token) {
        req.loggedUser = decodeToken( req.headers.token )
        next()
      } else { next({ status: 403, msg: 'Authentication Error' }) }
    }catch(err) { next(err) }
  },
  authorization: async (req, res, next) => {
    try{
      const att = await Attendance.findById( req.params.id )
      if( att.UserId == req.loggedUser.id ) next();
      else next({ status: 403, msg: 'Authorization Error' })
    }catch(err) { next(err) }
  },
  checkSecretCode ( req, res, next ) {
    try {
      if(req.body.secretCode) {
        req.secretUser = decodeToken( req.body.secretCode )
        next()
      } else { next({ status: 403, msg: 'need secret Code'})}
    } catch(err) { next(err) }
  },
  isMaster: async ( req, res, next ) => {
    try{
      const user = await User.findById( req.loggedUser.id )
      if( user.role === 'master' ) next();
      else next({ status: 400, msg: 'don\'t have access' })
    }catch(err) { next(err ) }
  },
  isStaff: async ( req, res, next ) => {
    try{
      const user = await User.findById( req.loggedUser.id );
      const { new_pin, old_pin } = req.body;
      if( new_pin && old_pin ) {
        if( user.pin_security === old_pin ) next();
        else next({ status: 400, msg: 'Invalid Old Pin Security' })
      }else{
        if( user.role === 'master' || user.role === 'HR Staff' || user.role === 'director' ) next();
        else next({ status: 400, msg: 'Dont have access' })
      }
    }catch(err) { next( err ) }
  },
  matchPin: async ( req, res, next ) => {
    try {
      const user = await User.findById( req.loggedUser.id );
      const { pin_security } = req.body;
      if( user.pin_security === pin_security ) next();
      else next({ status: 400, msg: 'invalid pin security' });
    }catch(err) { next( err ) }
  },
  isEmployee: async ( req, res, next ) => {
    try {
      const company = await Company.find();
      let pass = false;
      company[0].Employee.forEach((el, i) => {
        if ( el == req.loggedUser.id ) pass = true;
      })
      if( !pass ) next({ status: 400, msg: `Sorry youre not ${ company.name } family` });
      else next()
    }catch(err) { next( err ) }
  }
}