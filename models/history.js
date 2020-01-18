const { model, Schema } = require('mongoose'),

  HistorySchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    AttendanceId: { type: Schema.Types.ObjectId, ref: 'attendance' },
    createdAt: String
  }, { versionKey: false })

HistorySchema.pre('save', function(next) {
  const date = new Date();
  this.createdAt = date.toDateString();
  next();
})

module.exports = model('history', HistorySchema);