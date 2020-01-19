const { Attendance: Att, History } = require('../models');

module.exports = {
  createStartAtt: async ( req, res, next ) => {
    try {
      const attendance = await Att.find(),
        date = new Date(),
        start_image = req.body;
      let pass = attendance.filter(el => el.date === date.toDateString())
      if( pass.length === 0 ) res.status(201).json({ attendance: await (await Att.create({ UserId: req.loggedUser.id, start_image })).populate('UserId') }) 
      else next({ status: 400, msg: 'Absent can only be once a day'})
    }
    catch(err) { next(err) }
  },
  getAttUser: async ( req, res, next ) => {
    try{
      const presence = await Att.find();
      res.status(200).json({ attendance: presence.filter(el => el.UserId === req.loggedUser.id && el.end === '' ) })
    }catch(err){ next(err) }
  },
  updateEndAtt: async ( req, res, next ) => {
    try {
      const date = new Date();
      const attendance = await Att.findById( req.params.id );
      if( attendance.end ) next({ status: 400, msg: 'You already did it'});
      else {
        const updateAtt = await Att.findByIdAndUpdate( req.params.id, { end: date.toLocaleTimeString() }, { new: true } )
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