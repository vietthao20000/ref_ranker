const express = require('express');
const Router = express.Router();
const rewardConfigModel = require('./rewardConfigModel.js');

Router.get('/', (req, res) => {
  rewardConfigModel
    .find({})
    .sort({ created_time: 1 })
    .then(configs => res.success({ data: configs }))
})

Router.post('/', (req, res) => {
  if (req.body && req.body.data) {
    rewardConfigModel.create(req.body.data)
      .then(config => res.success({ data: config }))
  }
})

Router.put('/', (req, res) => {
  if (req.body && req.body.data) {
    rewardConfigModel.update({ _id: req.body.data._id}, req.body.data)
  }
})

module.exports = Router