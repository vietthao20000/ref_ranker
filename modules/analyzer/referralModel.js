const mongoose = require('mongoose')

let referralSchema = new mongoose.Schema({
  kid: { type: 'ObjectId', ref: 'Kids', required: true },
  config: { type: 'ObjectId', ref: 'RewardConfigs', required: true },
  referrals: [{
    type: 'ObjectId', 
    ref: 'Kids',
    unique: true
  }]
})

module.exports = mongoose.model('Referral', referralSchema)