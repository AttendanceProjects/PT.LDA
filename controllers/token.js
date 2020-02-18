const { Token } = require('../models'),
  { expo: { pushNotification } } = require('../helpers')


module.exports = {
  createToken: async (req, res, next) => {
    const { token_expo: token } = req.body;
    try{ res.status(201).json({ token: await Token.create({ UserId: req.loggedUser.id, token }) }) }
    catch(err){ next( err ) }
  },
  pushAllUserForAdmin: async (req, res, next) => { // admin only
    const { body, title } = req.body;
    try {
      const allToken = await Token.find();
      if( allToken ) {
        await allToken.forEach(async (el, i) => {
          await pushNotification(body, title, el.token)
        })
        res.status(200).json({ msg: 'Notification successfully sent!' })
      }
    }catch(err) { next( err ) }
  },
  pushOneUserForAdmin: async (req, res, next) => { // admin only
    const { body, title } = req.body;
    try {
      const getUser = await Token.find({ UserId: req.params.id });
      if( getUser ) {
        await getUser.forEach(async (el, i) => {
          await pushNotification(body, title, el.token)
        })
        res.status(200).json({ msg: 'Notification successfully sent!' })
      }
    }catch( err ) { next( err ) }
  }
}
