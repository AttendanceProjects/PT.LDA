const { model, Schema } = require('mongoose'),

  AttendanceSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    start: String,
    start_image: { type: String },
    end: String,
    end_image: { type: String, required: [ true, 'image end is required' ] },
    date: String,
  }, { versionKey: false })

AttendanceSchema.pre('save', function(next) { 
  let date = new Date();
  this.start = date.toLocaleTimeString();
  this.date = date.toDateString();
  this.end_image = '';
  this.end = '';
  next();
})

module.exports = model( 'attendance', AttendanceSchema );