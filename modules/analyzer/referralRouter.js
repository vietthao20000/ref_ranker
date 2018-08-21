const express = require('express');
const Router = express.Router();
const referralModel = require(__dirname + '/referralModel.js');
const mongoose = require('mongoose');

Router.patch('/', (req, res) => {
  if (req.body && req.body.data) {
    let updates = {
    }

    Object.keys(req.body.data).map(key => {
      updates['config.config.$.' + key] = req.body.data[key]
    })

    return referralModel.update({'config.config._id': req.body.data._id}, {'$set': updates})
      .then(resp => res.success({ data: resp }))
      .catch(err => {
        console.log(err);
        res.fail({ message: 'Update referral check & notes fail', data: err })
      })
  }

  res.fail({ message: 'Not enough data' });
})

Router.get('/dropReferralsCollection', (req, res) => {
  if (req.query && req.query.secret && req.query.secret === 'we_have_updated_our_privacy_policy') {
    mongoose.connection.db.dropCollection('referrals', (err, data) => {
      if (err) res.fail({ data: err });
      else res.success({ data });
    })
  }
})

Router.get('/dropConfigsCollection', (req, res) => {
  if (req.query && req.query.secret && req.query.secret === 'we_have_updated_our_privacy_policy') {
    mongoose.connection.db.dropCollection('rewardconfigs', (err, data) => {
      if (err) res.fail({ data: err });
      else res.success({ data });
    })
  }
})

module.exports = Router;