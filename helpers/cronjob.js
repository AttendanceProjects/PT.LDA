const { User, Attendance } = require('../models'),
  { date } = require('../helpers'),
  cron = require('node-cron');


cron.schedule("0 0 23 */1 * *", async () => {
  console.log( 'cronjob is done' );
  try {
    const allUsers = await User.find();
    const allAttendance = await Attendance.find({ date: date().toDateString() });
    allAttendance.forEach((att, i) => {
      allUsers.forEach(async (user, j) => {
        if( att.UserId == user._id ) {
          console.log( `${user.username} allready checkin` );
        }else {
          const att = await Attendance.create({ UserId: user._id, start_image: 'absent' })
          console.log( `att absent has created with attendance id => ${ att._id }` )
        }
      })
    })
    const getDate = await date().toDateString();
  }catch(err) { console.log( err ) }
})

module.exports = cron;