const { User, Company } = require('../models'),
  { hash, jwt, sendEmail, image: { deleteFileFromGCS } } = require('../helpers')

module.exports = {
  checkSignin: async ( req, res, next ) => {
    try{ res.status(200).json({ user: await User.findById( req.loggedUser.id ) }) }
    catch(err) { next(err) }
  },
  signup: async ( req, res, next ) => {
    const { username, password, email, role, phone, identityNumber, religion, gender } = req.body;
    try {
      const user = await User.create({ username, password, email, role, phone, identityNumber, religion, gender });
      const company = await Company.find();
      await Company.findByIdAndUpdate(company[0]._id, {$push: {Employee: user._id}});
      res.status(201).json({ user })
    }
    catch(err) { next(err) }
  },
  signin: async ( req, res, next ) => {
    const { request, password } = req.body;
    try {
      const user = await User.findOne({ $or: [ {username: request}, {email: request} ] })
      console.log( user );
      const company = await Company.find();
      console.log( company );
      let pass = false;
      company[0].Employee.forEach((el, i) => {
        if( String( el ) == String( user._id ) ) pass = true;
      })
      console.log( pass );
      if( pass ) {
        if( user && hash.comparePassword( password, user.password ) ) res.status(201).json({ user, token: jwt.signToken({ id: user._id, username: user.username, email: user.email, role: user.role }) })
        else next({ status: 400, msg: 'request/password wrong'})
      }else next({ status: 400, msg: 'sorry u\'re not member for this compnay' })
    } catch(err) { next(err) }
  },
  changePassword: async ( req, res, next ) => {
    const { newPass, oldPass } = req.body;
    try {
      const user = await User.findById( req.loggedUser.id );
      if( user && hash.comparePassword( oldPass, user.password ) ) res.status(200).json({ user: await User.findByIdAndUpdate( req.loggedUser.id, { password: hash.hashPassword( newPass ) }, {new: true} ), msg: 'success update your password' })
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
      }else next({ status: 400, msg: 'Sorry, wrong secret code' });
    }catch(err) { next(err) }
  },
  approval: async ( req, res, next ) => {
    try {
      const user = await User.find();
      res.status(200).json({ user: await user.filter(el => el.role !== 'worker') })
    } catch(err) { next(err) }
  },
  updateImage: async ( req, res, next ) => {
    try { 
      const user = await User.findById( req.loggedUser.id );
      if( user.profile_image !== 'https://storage.cloud.google.com/ptlda/Default/animation.jpeg?authuser=1' || user.profile_image !== 'https://00e9e64bac2a64d87c0bc0f42ee4f96b92662906876040ec8c-apidata.googleusercontent.com/download/storage/v1/b/ptlda/o/Default%2Fanimation.jpeg?qk=AD5uMEtV8ugUZmUbnXZV5rx9PV2x9Zymkk_xKGlBHkT3TzLbKX22RunYOsSp0gLfLVkiuPkoJTaKIMNPImdkI5kc7pP64mfru7eFLte_I9Wcfqt1tHJ5-PNYb_VXwpWy8iq0dnHT6FXb5TvslDcauz9Th9bjANlAc-iytImTG8cDN4JK7j8O6FztpQKgDhC-Zu4Bnpb0bCL2urYPuxw-6gbZXkQP4N8YMtIchm6WuP7BjeuXUEPAGqSGFtbHJoOFJMLQVwOXx19jJywesGNdFsYHThdolPSYw2Bv1eLjS8WrUSme40yYz_FbPJXwVTS3n7qVha_BSDJMEjPnvgG2BEpU_vkpEKuczl19hOIqJXL4a92UjlfcZn9xmEtsGQ3czRy0xvz_TwAoXBTdzHW9nXTDJu3CENi9j4Y68r_PrxtAVqXyaYRb95dZUyMTmAg6BYvnLcmzqQVqq0nW4zs331EQAdaB4-0B9Xlmycy4EzHHiMzusNU2gclDontx805Xo43fB9tDoYNVU9AU--SqY9j8R9_hp7m5ouMb24kO9kj70RH-9HzDElSsr4mnWlUY6EnSJC-wQcAzfKDe8pK_SDcrQfedVu4PmvuuDj2b_oi7-IpX8SKAMyIsBn04fABOgrt_gFuvuQrjiv_qQ9SyxR6c6t8U8r5Ebv8woCheGHnA5te2Anuu9bi1nsuteG79tUeWFD_gRHdOoSAe8Duau0y49Gpw21evHW66kYJhWtcSgg6N3XFVGnqk9rVKSSOgpM0Ji_9S_730HmhPwPMFvBcAoUIkH2PIYROMqbhEGxIp3oSRdMb6s6A' ){
        await deleteFileFromGCS( user.profile_image )
        res.status(201).json({ user: await User.findByIdAndUpdate( req.loggedUser.id, { profile_image: req.body.image }, { new: true } ) })
      }else {
        res.status(201).json({ user: await User.findByIdAndUpdate( req.loggedUser.id, { profile_image: req.body.image }, { new: true } ) })
      }
    }
    catch(err) { next( err ) }
  }
}