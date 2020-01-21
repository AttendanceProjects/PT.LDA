const { Attendance: Att, History } = require('../models'),
  { image, date } = require('../helpers'),
  { deleteFileFromGCS } = image

module.exports = {
  createStartAtt: async ( req, res, next ) => {
    try {
      const attendance = await Att.find();
      const { start_image } = req.body
      let pass = attendance.filter(el => el.date === date().toDateString())
      if( pass.length === 0 ) {
        const att = await Att.create({ UserId: req.loggedUser.id, start_image })
        const newatt = await Att.findById(att._id).populate('UserId');
        res.status(201).json({ attendance: newatt })
      }
      else {
        await deleteFileFromGCS( start_image );
        next({ status: 400, msg: 'Absent can only be once a day'})
      }
    }
    catch(err) { next(err) }
  },
  getAttUser: async ( req, res, next ) => {
    try{
      const presence = await Att.find().populate('UserId');
      res.status(200).json({ attendance: await presence.filter(el => String( el.UserId._id ) === String( req.loggedUser.id ) && !el.end && el.date === date().toDateString() )[0] })
    }catch(err){ next(err) }
  },
  updateEndAtt: async ( req, res, next ) => {
    const { end_image } = req.body;
    try {
      const attendance = await Att.findById( req.params.id );
      if( attendance.end ) {
        await deleteFileFromGCS( end_image );
        next({ status: 400, msg: 'You already Check Out'});
      }
      else {
        await Att.findByIdAndUpdate( req.params.id, { end: date().toLocaleTimeString(), end_image, end_truth: 'ok' }, { new: true } ).populate('UserId')
        const history = await History.create({ AttendanceId: req.params.id })
        const HisPopulate = await History.findById( history._id ).populate({
          path: 'AttendanceId',
          model: 'attendance',
          populate: {
            path: 'UserId',
            model: 'users'
          }
        })
        res.status(200).json({ history: HisPopulate })
      }
    } catch(err) { next(err ) }
  },
  uploadingImage: async ( req, res, next ) => {
    const url = req.file.cloudStoragePublicUrl;
    if( url ) res.status(201).json({ url });
    else next({ status: 400, msg: 'url not found!' })
  },
  updateTruthLocation: async ( req, res, next ) => {
    const { issues, type } = req.body;
    try {
      if( type === 'checkin' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate( req.params.id, { start_truth: issues }, { new: true } ).populate('UserId') })
      else if( type === 'checkout' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate( req.params.id, { end_truth: issues }, { new: true } ).populate('UserId') })
      else next({ status: 400, msg: 'Out of range' })
    }catch(err){ next(err) }
  }
}


/*
if( clock > 7 && time === 'AM' && clock < 10 && time === 'AM' ) {
  console.log( 'waktu absen datang' );
} else if( clock > 10 && clock < 5 && time === 'PM' ) {
  console.log( 'waktu kerja dianggap alfa' );
} else if( clock > 5 && time === 'PM' && clock < 7 && time === 'PM' ) {
  console.log( 'waktu absen pulang' );
} else console.log( 'diluar waktu kerja' );

*/