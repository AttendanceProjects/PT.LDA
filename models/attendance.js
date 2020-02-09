const { model, Schema } = require('mongoose'),

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

    status: String
  }, { versionKey: false, timestamps: true })

AttendanceSchema.pre('save', async function(next) {
  let IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
  this.start = this.start || new Date( IndoTime ).toLocaleTimeString();
  this.start_issues = '';
  this.start_location = {
    latitude: '',
    longitude: ''
  };
  this.date = this.date || new Date( IndoTime ).toDateString();
  this.end = '';
  this.end_image = '';
  this.end_issues = '';
  this.status = '';
  this.end_location = {
    latitude: '',
    longitude: ''
  };
  this.end_reason = ''
  next();
})

module.exports = model( 'attendance', AttendanceSchema );