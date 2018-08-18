const express = require('express');
const Router = express.Router();
const rewardConfigModel = require('./rewardConfigModel.js');

Router.get('/', (req, res) => {
  return rewardConfigModel
    .find({})
    .sort({ created_time: 1 })
    .then(configs => res.success({ data: configs }))
})

Router.post('/', (req, res) => {
  console.log(req.body)
  if (req.body && req.body.data) {
    return rewardConfigModel.create(req.body.data)
      .then(config => res.success({ data: config }))
      .catch(err => {
        console.log(err)
        return res.fail({ 
          message: 'Create new config error',
          data: err
        })
      })
  }

  return res.fail({ message: 'Not enough data'})
})

Router.put('/', (req, res) => {
  console.log(req.body)
  if (req.body && req.body.data) {
    return rewardConfigModel.update({ _id: req.body.data._id }, req.body.data)
      .then(config => res.success({ data: config }))
      .catch(err => {
        console.log(err)
        return res.fail({ 
          message: 'Update config error',
          data: err
        })
      })
  }

  return res.fail({ message: 'Not enough data'})
})

module.exports = Router