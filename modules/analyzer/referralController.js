// require('dotenv').config({ path: __dirname + '/../../.env' })
const referralModel = require('./referralModel.js');
const utils = require('../utils');
const analyzerController = require('./analyzerController.js');
const mongoose = require('mongoose');
const kidsModel = require('./kidsModel.js');
const rewardConfigModel = require('./rewardConfigModel.js');
const _ = require('lodash')

// dummy_user = {
//     "course": {
//         "slug": "hoc-lap-trinh-tu-co-ban-hoc-sinh-cap-ba"
//     },
//     "kid": {
//         "facebook": "https://facebook.com/lina.vu.97",
//         "phone": "01672075654",
//         "mail": "huynhtuanhuy19896@gmail.com",
//         "institude": "asdasd",
//         "dob": "2018-07-18T12:00:00+07:00",
//         "name": {"first": "Test", "last": "Test"},
//         "experience": "sadassadds",
//         "inviteBy": "https://facebook.com/100013265649303"
//     },
//     "_id": "5b553034cdae66b3fd7c0dd6",
//     "connectBy": "Google",
//     "method": "Registration by Website",
//     "utm_campaign": "",
//     "utm_medium": "",
//     "utm_source": "",
//     "createdAt": "2018-07-23T01:32:36.284Z",
//     "updatedAt": "2018-07-23T01:32:36.284Z",
//     "__v": 0
// }

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
                count: 1,
                reward: -1
              }] 
            };
            return rewardConfigModel.create(reward)
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

// mongoose.connect(process.env.dburi)
//   .then(() => {
//     console.log('DB connected')
//     addNewRef(dummy_user).then(resp => console.log(resp))
//   })
//   .catch(err => {
//     console.log(err)
//   })

module.exports = { addNewRef }