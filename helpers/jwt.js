module.exports = {
  signToken( payload ) { return require('jsonwebtoken').sign( payload, process.env.JWT_SECRET ) },
  decodeToken( token ) { return require('jsonwebtoken').verify( token, process.env.JWT_SECRET ) }
}