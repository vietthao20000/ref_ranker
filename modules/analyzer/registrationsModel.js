const mongoose = require('mongoose')

let registrationSchema = new mongoose.Schema({
  studystatus: {type: 'Mixed'}
})

module.exports = mongoose.model('registrations', registrationSchema)