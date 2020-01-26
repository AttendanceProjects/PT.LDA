const { Attendance: Att } = require('../models'),
  { image, date } = require('../helpers'),
  { deleteFileFromGCS } = image

module.exports = {
  getAllAttendance: async ( req, res, next ) => { // for Admin or HRD get all employee attendance
    try{ res.status(200).json({ attendance: await Att.find().populate('UserId') }) }
    catch(err) { next(err) }
  },
  getOneUserAttendance: async (req, res, next) => { // get all attendance for /Users
    try { res.status(200).json({ attendance: await Att.find({ UserId: req.loggedUser.id }).populate('UserId').sort([[ 'createdAt', 'descending' ]]) }) }
    catch(err) { next(err) }
  },
  createStartAtt: async ( req, res, next ) => { // create attendance
    try {
      const attendance = await Att.find();
      const { start_image } = req.body
      let pass = attendance.filter(el => el.date === date().toDateString() && attendance.UserId === req.loggedUser.id)
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
  getAttUser: async ( req, res, next ) => { // get UserAtt for checkin dashboard
    try{
      const presence = await Att.find().populate('UserId');
      res.status(200).json({ attendance: await presence.filter(el => String( el.UserId._id ) === String( req.loggedUser.id ) && !el.end && el.date === date().toDateString() )[0] })
    }catch(err){ next(err) }
  },
  updateEndAtt: async ( req, res, next ) => { // delete from dashboard and checkout
    const { end_image } = req.body;
    try {
      const attendance = await Att.findById( req.params.id );
      if( attendance.end ) {
        await deleteFileFromGCS( end_image );
        next({ status: 400, msg: 'You already Check Out'});
      }
      else {
        const attendance = await Att.findByIdAndUpdate( req.params.id, { end: date().toLocaleTimeString(), end_image }, { new: true } ).populate('UserId')
        res.status(200).json({ attendance })
      }
    } catch(err) { next(err ) }
  },
  uploadingImage: async ( req, res, next ) => { // for uploading image to gcs
    const url = req.file.cloudStoragePublicUrl;
    if( url ) res.status(201).json({ url });
    else next({ status: 400, msg: 'url not found!' })
  },
  updateLocation: async ( req, res, next ) => { // for update location longitude & latitude
    const { location, accuracy, reason } = req.body,
      { os, type, id } = req.params,
      numAcc = Number( accuracy )
    try {
      let issues;
      if( os === 'android' ) {
        if( numAcc > 15 && numAcc < 21 ) issues = 'warning';
        else if( numAcc > 20 ) issues = 'ok';
        else issues = 'danger';
      } else  {
        if( numAcc > 40 && numAcc < 55 ) issues = 'warning';
        else if( numAcc > 54 ) issues = 'ok';
        else issues = 'danger'; // kemungkinan kecil ke kondisi ini *
      }
      if( type === 'checkin' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { start_location: location, start_issues: issues }, { new: true }).populate('UserId') });
      else if( type === 'checkout' ) {
        if( date().toLocaleTimeString().split(':')[0] < 5 && date().toLocaleTimeString().split(' ')[1] === 'PM' && date().toLocaleTimeString().split(':')[0] < 12 && date().toLocaleTimeString().split(' ')[1] === 'AM' ) {
          if( !reason ) next({ status: 400, msg: 'give us your reason to go home first' })
          else res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { end_location: location, end_reason: reason, end_issues: issues }, {new: true}).populate('UserId') })
        } else res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { end_location: location, end_issues: issues, end_reason: reason }, { new: true }).populate('UserId') })
      }else next({ status: 404, msg: 'Invalid Request' })
    }catch(err){ next(err ) }
  },
  deleteCauseFail: async ( req, res, next ) => { // delete attendance if failed update location or can use by hrd if want delete this route
    try {
      const attendance = await Att.findById( req.params.id );
      if( attendance.start_image ) await deleteFileFromGCS( attendance.start_image );
      if( attendance.end_image ) await deleteFileFromGCS( attendance.end_image );
      await Att.findByIdAndDelete( req.params.id );
      res.status(200).json({ msg: 'success delete attendance' });
    }catch(err){ next(err) }
  },
  getDailyHistory: async (req, res, next) => { // check user allready checkin or new or allready checkout
    try {
      const attendance = await Att.find({ UserId: req.loggedUser.id });
      const filterTime = await attendance.filter(el => el.date === date().toDateString());
      let status;
      if( filterTime.length > 0 ) status = 'ok';
      else status = 'nope';
      res.status(200).json({ msg: status });
    }catch(err){ next(err) }
  },
  revisiLocation: async (req, res, next) => { // for user revisi location * next step
    const { location, accuracy } = req.body,
      { type, os, id } = req.params,
      numAcc = Number( accuracy )
    try {
      let issues;
      if( os === 'android' ) {
        if( numAcc > 15 && numAcc < 21 ) issues = 'warning';
        else if( numAcc > 20 ) issues = 'ok';
        else issues = 'danger';
      } else {
        if( numAcc > 40 && numAcc < 55 ) issues = 'warning';
        else if( numAcc > 54 ) issues = 'ok';
        else issues = 'danger';
      }
      if( type === 'checkin' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { start_location: location, start_issues: issues }, { new: true }).populate('UserId') });
      else if( type === 'checkout' ) res.status(200).json({ attendance: await Att.findByIdAndUpdate(id, { end_location: location, end_issues: issues }, { new: true }).populate('UserId') });
      else next({ status: 400, msg: 'Invalid Request' })
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