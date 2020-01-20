const { model, Schema } = require('mongoose'),

  AttendanceSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    start: String,
    start_image: { type: String, required: [ true, 'image start is required' ] },
    end: String,
    end_image: String,
    date: String,
  }, { versionKey: false })

AttendanceSchema.pre('save', function(next) {
  var IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    IndoTime = new Date(IndoTime);
  this.start = IndoTime.toLocaleTimeString();
  this.IndoTime = IndoTime.toDateString();
  this.end_image = '';
  this.end = '';
  next();
})

module.exports = model( 'attendance', AttendanceSchema );