const referralModel = require('./referralModel.js');
const utils = require('../utils');
const analyzerController = require('./analyzerController.js');
const mongoose = require('mongoose');
const kidsModel = require('./kidsModel.js');
const rewardConfigModel = require('./rewardConfigModel.js');
const _ = require('lodash')

addNewRef = (user) => {
  fb_url = user.kid.inviteBy
  username = utils.parseFbProfile(fb_url)

  return utils.parseFbUsername([username], process.env.token)
    .then(resp => resp[username].id)
    .then(uid => kidsModel.findOne({ uid }))
    .then(invitor => {
      if (!invitor) throw 'User not exist'

      return invitor._id
    })
    .then(_id => {
      let reward_promise = rewardConfigModel
        .find({})
        .sort({ created_time: -1 })
        .limit(1)
        .then(reward => {
          if (!reward || !reward.length) {
            reward = { 
              created_time: Date.now(), 
              config: [{
                count: 0,
                reward: 0
              }] 
            };

            return reward;
          }

          return reward[0]
        })

      let referral_promise = referralModel.findOne({ kid: _id })

      return Promise.all([
        reward_promise,
        referral_promise
      ])
      .then(([reward, invitor]) => {
        if (invitor) {
          invitor.referrals.push(user.kid._id);
          return invitor.save()
        } else {
          data = {
            kid: _id,
            config: reward,
            referrals: [ user.kid._id ]
          }

          return referralModel.create(data)
        }
      })
    })
    .catch(err => {
      if (err === 'User not exist') return null;
      else console.log(err);
    });
}

module.exports = { addNewRef }