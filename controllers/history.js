const { History } = require('../models');

module.exports = {
  GetUserHistory: async ( req, res, next ) => {
    try { res.status(200).json({ history: await (await History.find().sort([[ 'createdAt', 'descending' ]]).populate('AttendanceId').populate('UserId')).filter(el => el.UserId === req.loggedUser.id ) }) }
    catch(err) { next( err ) }
  }
}