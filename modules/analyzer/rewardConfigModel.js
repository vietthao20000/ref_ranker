const mongoose = require('mongoose')

let rewardSchema = new mongoose.Schema({
  created_time: 'Number',
  reward_config: [{
    count: 'Number',
    reward: 'Number'
  }]
})

module.exports = mongoose.model('RewardConfig', rewardSchema)