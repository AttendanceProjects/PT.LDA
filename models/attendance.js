const { model, Schema } = require('mongoose'),
  { date: serverTime } = require('../helpers'),

  AttendanceSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    start: String,
    start_image: { type: String, required: [ true, 'image start is required' ] },
    start_issues: String,
    start_reason: String,
    start_location: {
      latitude: String,
      longitude: String
    },
    end: String,
    end_image: String,
    end_issues: String,
    end_location: {
      latitude: String,
      longitude: String
    },
    end_reason: String,
    date: String,
  }, { versionKey: false, timestamps: true })

AttendanceSchema.pre('save', async function(next) {
  console.log( serverTime(), 'get Time' );
  const getDate = await serverTime();
  this.start = getDate.toLocaleTimeString();
  this.start_issues = '';
  this.start_location = {
    latitude: '',
    longitude: ''
  };
  this.date = getDate.toDateString();
  this.end = '';
  this.end_image = '';
  this.end_issues = '';
  this.end_location = {
    latitude: '',
    longitude: ''
  };
  this.end_reason = ''
  next();
})

module.exports = model( 'attendance', AttendanceSchema );