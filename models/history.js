const { model, Schema } = require('mongoose'),
  { date } = require('../helpers')

  HistorySchema = new Schema({
    AttendanceId: { type: Schema.Types.ObjectId, ref: 'attendance' },
    createdAt: String
  }, { versionKey: false })

HistorySchema.pre('save', function(next) {
  this.createdAt = date().toDateString()
  next();
})

module.exports = model('history', HistorySchema);