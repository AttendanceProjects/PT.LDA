const { Company } = require('../models');

module.exports = {
  createCompany: async (req, res, next) => {
    const { name, location, start, end } = req.body;
    try { res.status(201).json({ company: await Company.create({ name, location, start, end }) }) }
    catch(err) { next(err) }
  },
  getInfoCompnay: async (req, res, next) => {
    try {
      const company = await Company.find()
      res.status(200).json({ company: company[0] })
    }catch(err) { next(err) }
  }
}