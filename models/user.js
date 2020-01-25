const { model, Schema } = require('mongoose'),

  UserSchema = new Schema({
    username: { type: String, required: [true, 'username is required'], unique: true },
    password: { type: String, required: [true, 'password is required'], minlength: [5, 'password min 5 char'] },
    email: { type: String, required: [true, 'email is required'], unique: true },
    profile_image: String,
    // new & belum di handle di controller
    role: String,
    join: String,
    gender: { type: String, required: [true, 'gender is required'] },
    phone: { type: String, required: [true, 'phone number is required'] },
    religion: String,
    identityNumber: Number
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
  this.join = new Date();
  this.password = require('../helpers').hash.hashPassword( this.password );
  this.profile_image = 'https://storage.cloud.google.com/defaultimage/59162520-blanco-perfil-de-usuario-icono-en-el-boto%CC%81n-negro-aislado-en-blanco.jpg?authuser=0';
  if( this.role ) this.role = this.role;
  else this.role = 'worker';
  next()
})

const User = model('users', UserSchema);

module.exports = User;