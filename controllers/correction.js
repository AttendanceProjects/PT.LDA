const { Correct, Attendance: Att, User } = require('../models'),
  { image: { deleteFileFromGCS }, hash: { comparePassword } } = require('../helpers')

module.exports = {
  createCorrection: async (req, res, next) => {
    let { reason, image, start_time, end_time, id} = req.body;
    start_time = new Date( start_time ).toLocaleTimeString();
    end_time = new Date( end_time ).toLocaleTimeString();
    try {
      const correct = await Correct.findOne({ AttId: id })
      if( correct ) next({ status: 400, msg: 'This attendance on request correction' })
      else {
        const correct = await Correct.create({ UserId: req.loggedUser.id, AttId: id, reason, image, start_time, end_time })
        console.log( correct, 'is correct' );
        if( correct ) res.status(201).json({ msg: 'Your request has been sent' })
        else next({ status: 400, msg: 'something error, please try again' })
      }
    }catch(err) { await deleteFileFromGCS( image ); next( err ); }
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
    if( response === 'acc' || response === 'dec' ) {
      try{
        const correction = await Correct.findByIdAndUpdate( id, { status: response }, { new: true }).populate('AttId');
        if ( correction && response === 'acc' ) {
          const attendance = await Att.findByIdAndUpdate( correction.AttId, { start: correction.start_time, end: correction.end_time }, { new: true } );
          if( attendance ) {
            res.status(200).json({ msg: 'accept' })
          }
        }else res.status(200).json({ msg: 'decline'})
      }catch(err) { next( err ) }
    }else next({ status: 400, msg: 'Invalid search keyword' })
  },
  seeAllRequestIn: async (req, res, next) => {
    try { res.status(200).json({ correction: await Correct.find({ status: 'req' }).populate( 'UserId' ) }) }
    catch(err) { next( err ) }
  },
  getOneCorrection: async ( req, res, next ) => {
    try {
      res.status(200).json({ correction: await Correct.findById( req.params.id ).populate('UserId').populate('AttId') })
    }catch(err) { next( err ) }
  }
}