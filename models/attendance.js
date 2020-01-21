const { model, Schema } = require('mongoose'),
  { date } = require('../helpers'),

  AttendanceSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    start: String,
    start_image: { type: String, required: [ true, 'image start is required' ] },
    start_issues: String,
    end: String,
    end_image: String,
    end_issues: String,
    date: String,
  }, { versionKey: false })

AttendanceSchema.pre('save', function(next) {
  this.start = date().toLocaleTimeString();
  this.start_issues = 'ok';
  this.date = date().toDateString();
  this.end_issues = '';
  this.end_image = '';
  this.end = '';
  next();
})

module.exports = model( 'attendance', AttendanceSchema );