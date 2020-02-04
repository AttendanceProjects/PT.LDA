const { Correct, Attendance: Att } = require('../models')


module.exports = {
  createCorrection: async (req, res, next) => {
    const { reason, image } = req.body;
    try {
      const correct = await Correct.findOne({ AttId: req.params.id })
      if( correct ) next({ status: 400, msg: 'This attendance on request correction' })
      else {
        const correct = await Correct.create({ UserId: req.loggedUser.id, AttId: req.params.id, reason, image })
        if( correct ) res.status(201).json({ msg: 'Your request has been sent' })
        else next({ status: 400, msg: 'something error, please try again' })
      }
    }catch(err) { next( err ) }
  },
  getUserCorrection: async (req, res, next) => {
    try {
      const correction = await Correct.find({ UserId: req.loggedUser.id }).populate('AttId').sort([[ 'createdAt', 'descending' ]]);
      res.status(200).json({ correction })
    }catch(err) { next( err ) }
  },
  findFilter: async (req, res, next) => {
    const { key } = req.query;
    if( key === 'req' || key === 'acc' || key === 'dec' ) {
      try {
        res.status(200).json({ correction: await Correct.find({ status: key }).populate('AttId').sort([[ 'createdAt', 'descending' ]]) });
      } catch(err) { next( err ) }
    }else next({ status: 400, msg: 'Invalid search keyword' })
  },
  responseCorrection: async (req, res, next) => {
    const { res: response, id } = req.params;
    if( res === 'acc' || res === 'dec' ) {
      res.status(200).json({ correction: await Correct.findByIdAndUpdate(id, { status: response }, { new: true }).populate('AttId'), msg: res })
    }else next({ status: 400, msg: 'Invalid search keyword' })
  },
  seeAllRequestIn: async (req, res, next) => {
    try { res.status(200).json({ correction: await Correct.find({ status: status === 'req' }) }) }
    catch(err) { next( err ) }
  }
}