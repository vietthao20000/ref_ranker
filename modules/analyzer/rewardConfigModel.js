const mongoose = require('mongoose')

let rewardSchema = new mongoose.Schema({
  created_time: 'Number',
  config: [{
    count: 'Number',
    reward: 'Number',
    _id: 0
  }]
})

module.exports = mongoose.model('RewardConfig', rewardSchema)