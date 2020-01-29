const { jwt } = require('../helpers'),
  { decodeToken } = jwt,
  { User, Attendance } = require('../models'),
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
  }
}