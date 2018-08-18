const mongoose = require('mongoose')

let referralSchema = new mongoose.Schema({
  kid: { type: 'ObjectId', ref: 'Kids', required: true },
  config: {
    created_time: 'Number',
    config: [{
      count: 'Number',
      reward: 'Number',
      paid: 'Boolean',
      notes: 'String'
    }]
  },
  referrals: [{
    type: 'ObjectId', 
    ref: 'Kids'
  }]
})

module.exports = mongoose.model('Referral', referralSchema)