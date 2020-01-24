const { History } = require('../models');

module.exports = {
  GetUserHistory: async ( req, res, next ) => {
    try { 
      const history = await History.find({ UserId: req.loggedUser.id }).populate({
        path: 'AttendanceId',
        model: 'attendance',
        populate: {
          path: 'UserId',
          model: 'users'
        }
      }).sort([[ 'createdAt', 'descending' ]])
      res.status(200).json({ history }) 
    }
    catch(err) { next( err ) }
  }
}