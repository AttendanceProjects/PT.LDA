const { model, Schema } = require('mongoose'),

  CorrectSchema =  new Schema({
    AttId: { type: Schema.Types.ObjectId, ref: 'attendance' },
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    reason: { type: String, required: [true, 'reason is required'] },
    image: String,
    start: String,
    end: String,
    status: String
  }, { timestamps: true, versionKey: false })

  CorrectSchema.pre('save', function(next) {
    this.status='req';
    next();
  })

module.exports = model('correction', CorrectSchema);