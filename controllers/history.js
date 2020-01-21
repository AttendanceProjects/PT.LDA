const { History } = require('../models');

module.exports = {
  GetUserHistory: async ( req, res, next ) => {
    try { 
      const history = await History.find().populate({
        path: 'AttendanceId',
        model: 'attendance',
        populate: {
          path: 'UserId',
          model: 'users'
        }
      }).sort([[ 'createdAt', 'descending' ]])
      res.status(200).json({ history: await history.filter(el => el.AttendanceId.UserId._id === req.loggedUser.id ) }) 
    }
    catch(err) { next( err ) }
  }
}