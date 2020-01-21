const { model, Schema } = require('mongoose'),
  { date } = require('../helpers'),

  AttendanceSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    start: String,
    start_image: { type: String, required: [ true, 'image start is required' ] },
    start_truth: String,
    end: String,
    end_image: String,
    end_truth: String,
    date: String,
    truth: String
  }, { versionKey: false })

AttendanceSchema.pre('save', function(next) {
  this.start = date().toLocaleTimeString();
  this.start_truth = 'ok';
  this.date = date().toDateString();
  this.end_truth = '';
  this.end_image = '';
  this.end = '';
  next();
})

module.exports = model( 'attendance', AttendanceSchema );