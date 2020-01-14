const { model, Schema } = require('mongoose'),

  UserSchema = new Schema({
    username: { type: String, required: [true, 'username is required'], unique: true },
    password: { type: String, required: [true, 'password is required'], minlength: [5, 'password min 5 char'] },
    email: { type: String, required: [true, 'email is required'], unique: true },
    role: String
  }, { versionKey: false, timestamps: true })

UserSchema.path('username').validate(function( val ){
  return User.findOne({ username: val })
    .then(user => { if(user) return false })
}, `username allready used!`)

UserSchema.path('email').validate(function( val ){
  return User.findOne({ email: val })
    .then(user => { if(user) return false})
}, `email allready used!`)

UserSchema.pre('save', function(next) {
  this.password = require('../helpers').hash.hashPassword( this.password );
  if( this.role ) this.role = this.role;
  else this.role = 'worker';
  next()
})

const User = model('users', UserSchema);

module.exports = User;