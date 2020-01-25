const { model, Schema } = require('mongoose'),

  CompanySchema = new Schema({
    company_name: { type: String, required: [true, 'Company Name is required'], unique: true },
    location: {
      longitude: String,
      latitude: String
    },
    start: String,
    end: String,
    Employee: [{ type: Schema.Types.ObjectId, ref: 'users' }]
  }, { timestamps: true, versionKey: false })

CompanySchema.path('company_name').validate(function(val) {
  return Company.findOne({ name: val })
    .then(com => { if( com ) return false })
}, 'Company name is allready used!')

const Company = model('company', CompanySchema);

module.exports = Company;
// 10/20/2020 08:00:00 format date Time