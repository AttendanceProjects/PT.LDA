const { User, Company } = require('../models'),
  { hash, jwt, sendEmail } = require('../helpers')

module.exports = {
  checkSignin: async ( req, res, next ) => {
    try{ res.status(200).json({ user: await User.findById( req.loggedUser.id ) }) }
    catch(err) { next(err) }
  },
  signup: async ( req, res, next ) => {
    const { username, password, email, role } = req.body;
    try {
      const user = await User.create({ username, password, email, role });
      const company = await Company.find();
      await Company.findByIdAndUpdate(company[0]._id, {$push: {Employee: user._id}});
      res.status(201).json({ user: await User.create({ username, password, email, role }) })
    }
    catch(err) { next(err) }
  },
  signin: async ( req, res, next ) => {
    const { request, password } = req.body;
    try {
      const user = await User.findOne({ $or: [ {username: request}, {email: request} ] })
      if( user && hash.comparePassword( password, user.password ) ) res.status(201).json({ user, token: jwt.signToken({ id: user._id, username: user.username, email: user.email, role: user.role }) })
      else next({ status: 400, msg: 'request/password wrong'})
    } catch(err) { next(err) }
  },
  changePassword: async ( req, res, next ) => {
    const { newPass, oldPass } = req.body;
    try {
      const user = await User.findById( req.loggedUser.id );
      if( user && hash.comparePassword( oldPass, user.password ) ) res.status(200).json({ user: await User.findByIdAndUpdate( req.loggedUser.id, { password: hash.hashPassword( newPass ) }, {new: true} ) })
      else next({ status: 400, msg: 'wrong old password'})
    } catch(err) { next(err) }
  },
  forgotPassword: async  ( req, res, next ) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email })
      if( user ) {
        const msg = await sendEmail( email, {
        msg: `
  Reset Password request..
  your secret code ${ jwt.signToken({ id: user._id, email: user.email }) }
  `
          })
        res.status(200).json({ msg })
      } else next({ status: 404, msg: `${ email } is not regitered to our company`})
    } catch(err) { next(err) }
    
  },
  confirmSecretCode: async ( req, res, next ) => {
    const { newPass } = req.body;
    try{
      const user = await User.findById( req.secretUser.id )
      if( user && req.secretUser.email === user.email ) {
        res.status(200).json({ user: await User.findByIdAndUpdate( req.secretUser.id, {password: hash.hashPassword( newPass )}, {new: true} ) })
      }else { console.log('masuk sini jg?')}
    }catch(err) { next(err) }
  },
  approval: async ( req, res, next ) => {
    try {
      const user = await User.find();
      res.status(200).json({ user: await user.filter(el => el.role !== 'worker') })
    } catch(err) { next(err) }
  },
  updateImage: async ( req, res, next ) => {
    try { res.status(201).json({ user: await User.findByIdAndUpdate( req.loggedUser.id, { profile_image: req.body.image } ) }) }
    catch(err) { next( err ) }
  }
}