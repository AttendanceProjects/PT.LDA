const { model, Schema } = require('mongoose'),

  TokenSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'users' },
    token: String
  }, { versionKey: false, timestamps: true })

module.exports = model('token', TokenSchema);