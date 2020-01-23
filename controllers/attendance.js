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
        const history = await History.create({ AttendanceId: req.params.id, UserId: req.loggedUser.id })
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
  // updateTruthLocation: async ( req, res, next ) => {
  //   const { issues, type } = req.body;
  //   try {
  //     if( type === 'checkin' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate( req.params.id, { start_issues: issues }, { new: true } ).populate('UserId') })
  //     else if( type === 'checkout' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate( req.params.id, { end_issues: issues }, { new: true } ).populate('UserId') })
  //     else next({ status: 400, msg: 'Out of range' })
  //   }catch(err){ next(err) }
  // },
  updateLocation: async ( req, res, next ) => {
    const { location, accuracy, reason } = req.body,
      { os, type, id } = req.params,
      numAcc = Number( accuracy )
    try {
      let issues;
      if( os === 'android' ) {
        if( numAcc > 15 && numAcc < 21 ) issues = 'warning';
        else if( numAcc > 21 ) issues = 'ok';
        else issues = 'danger';
      } else  {
        if( numAcc > 40 && numAcc < 55 ) issues = 'warning';
        else if( numAcc > 54 ) issues = 'ok';
        else issues = 'danger'; // kemungkinan kecil ke kondisi ini *
      }
      if( type === 'checkin' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { start_location: location, start_issues: issues }, { new: true }).populate('UserId') });
      else if( type === 'checkout' ) {
        if( date().toLocaleTimeString().split(':')[0] < 5 && date().toLocaleTimeString().split(' ')[1] === 'PM' ) {
          if( !reason ) next({ status: 400, msg: 'give us your reason to go home first' })
          else res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { end_location: location, end_reason: reason, end_issues: issues }, {new: true}).populate('UserId') })
        } else res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { end_location: location, end_issues: issues }, { new: true }).populate('UserId') })
      }else next({ status: 404, msg: 'Invalid Request' })
    }catch(err){ next(err ) }
  },

  deleteCauseFail: async ( req, res, next ) => {
    try {
      const attendance = await Att.findById( req.params.id );
      if( attendance.start_image ) await deleteFileFromGCS( attendance.start_image );
      if( attendance.end_image ) await deleteFileFromGCS( attendance.end_image );
      await Att.findByIdAndDelete( req.params.id );
      res.status(200).json({ msg: 'success delete attendance' });
    }catch(err){ next(err) }
  },
  getDailyHistory: async (req, res, next) => {
    try {
      const history = await History.find({ UserId: req.loggedUser.id });
      const filterTime = await history.filter(el => el.createdAt === date().toDateString());
      let status;
      if( filterTime.length > 0 ) status = 'ok'
      else status = 'nope'
      res.status(200).json({ msg: status })
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