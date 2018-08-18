const express = require('express');
const Router = express.Router();
const referralModel = require(__dirname + '/referralModel.js');

Router.patch('/', (req, res) => {
  if (req.body && req.body.data) {
    let updates = {
    }

    Object.keys(req.body.data).map(key => {
      updates['config.config.$.' + key] = req.body.data[key]
    })

    return referralModel.update({'config.config._id': req.body.data._id}, {'$set': updates})
      .then(resp => res.success({ data: resp }))
  }

  res.fail({ message: 'Not enough data' });
})

module.exports = Router;