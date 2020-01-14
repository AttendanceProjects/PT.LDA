module.exports = { 
  hashPassword( password ) { return require('bcryptjs').hashSync( password, require('bcryptjs').genSaltSync(10) ) },
  comparePassword( password, hashed ) { return require('bcryptjs').compareSync( password, hashed ) }
}