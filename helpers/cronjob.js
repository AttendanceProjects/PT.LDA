const { User, Attendance } = require('../models'),
  cron = require('node-cron');


cron.schedule("0 0 0 * * * ", async () => {
  // cron.schedule('0 0 0 0 1 *', async () => {
  console.log( 'CronJob is Running' );
  try {
    const date = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    const allUsers = await User.find();
    const allAttendance = await Attendance.find({ date: new Date( date ).toDateString() });
    allAttendance.forEach((att, i) => {
      allUsers.forEach(async (user, j) => {
        if( String(att.UserId) == String(user._id) ) {
          console.log( `${user.username} allready checkin` );
        }else {
          const { _id: id } = await Attendance.create({ UserId: user._id, start_image: 'absent' })
          console.log( `att absent has created with attendance id => ${ id }` )
        }
      })
    })
    // const getDate = await date().toDateString();
  }catch(err) { console.log( err ) }
})

module.exports = cron;

// 94c1d