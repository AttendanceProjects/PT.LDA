const { Token } = require('../models')

module.exports = {
  createToken: async (req, res, next) => {
    const { token_expo: token } = req.body;
    try{ res.status(201).json({ token: await Token.create({ UserId: req.loggedUser.id, token }) }) }
    catch(err){ next( err ) }
  },
  getAllTokenForAdmin: async (req, res, next) => { // admin only
     try{ res.status(200).json({ token: await Token.find().populate('UserId') }) }
     catch(err){ next( err ) }
  },
  getOneTokenForPush: async (req, res, next) => { // admin only
    try{ res.status(200).json({ token: await Token.find({ UserId: req.params.id }) }) }
    catch(err){ next( err ) }
  }
}