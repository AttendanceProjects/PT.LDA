const { Attendance: Att, History } = require('../models');

module.exports = {
  createStartAtt: async ( req, res, next ) => {
    try {
      const attendance = await Att.find();
      const { start_image } = req.body
      var IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
        IndoTime = new Date(IndoTime);
      let pass = attendance.filter(el => el.date === IndoTime.toDateString())
      if( pass.length === 0 ) {
        const att = await Att.create({ UserId: req.loggedUser.id, start_image })
        const newatt = await Att.findById(att._id).populate('UserId');
        res.status(201).json({ attendance: newatt })
      }
      else next({ status: 400, msg: 'Absent can only be once a day'})
    }
    catch(err) { next(err) }
  },
  getAttUser: async ( req, res, next ) => {
    var IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
      IndoTime = new Date(IndoTime);
    try{
      const presence = await Att.find().populate('UserId');
      res.status(200).json({ attendance: await presence.filter(el => String( el.UserId._id ) === String( req.loggedUser.id ) && !el.end && el.date === IndoTime.toDateString() )[0] })
    }catch(err){ next(err) }
  },
  updateEndAtt: async ( req, res, next ) => {
    const { end_image } = req.body;
    try {
      var IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
        IndoTime = new Date(IndoTime);
      const attendance = await Att.findById( req.params.id );
      if( attendance.end ) next({ status: 400, msg: 'You already did it'});
      else {
        const updateAtt = await Att.findByIdAndUpdate( req.params.id, { end: IndoTime.toLocaleTimeString(), end_image }, { new: true } ).populate('UserId')
        const history = await History.create({ UserId: req.loggedUser.id, AttendanceId: req.params.id })
        res.status(200).json({ attendance: updateAtt, history })
      }
    } catch(err) { next(err ) }
  },
  uploadingImage: async ( req, res, next ) => {
    console.log('masuk')
    const url = req.file.cloudStoragePublicUrl;
    if( url ) res.status(201).json({ url });
    else next({ status: 400, msg: 'url not found!' })
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