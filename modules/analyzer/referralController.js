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
    .then(resp => {
      if (!resp[username]) {
        throw {resp, username, user};
      }

      return resp[username].id
    })
    .then(uid => kidsModel.findOne({ uid }))
    .then(invitor => {
      if (!invitor) throw 'User not exist'

      return invitor
    })
    .then(invitor => {
      let _id = invitor._id
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
      .then(([reward, invitor_ref]) => {
        if (invitor_ref) {
          invitor_ref.referrals.push(user.kid._id);
          return invitor_ref
            .save()
            .then(created => {
              return { 
                ...invitor.toObject(),
                ...created.toObject(), 
              }
            })
        } else {
          data = {
            kid: _id,
            config: reward,
            referrals: [ user.kid._id ]
          }

          return referralModel
            .create(data)
            .then(created => {
              return { 
                ...invitor.toObject(),
                ...created.toObject(), 
              }
            })
        }
      })
    })
    .catch(err => {
      if (err === 'User not exist') return null;
      else {
        console.log('Error: ')
        console.log(err);
      }
    });
}

module.exports = { addNewRef }