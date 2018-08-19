const express = require('express')
const Router = express.Router()
const analyzerController = require(__dirname + '/analyzerController.js')

Router.get('/getAnalyzed', (req, res) => {
  let start_time = parseInt(req.query.start_time) || 0
  let end_time = parseInt(req.query.end_time) || Date.now()

  start_time = new Date(start_time)
  end_time = new Date(end_time)

  analyzerController
    .getAnalyzed(start_time, end_time)
    .then(doc => res.success({ data: doc }))
    .catch(err => {
      console.log(err)
      res.fail({ message: 'Get analyzed fail', data: err })
    })
})

Router.get('/getAnalyzed1', (req, res) => {
  let start_time = parseInt(req.query.start_time) || 0
  let end_time = parseInt(req.query.end_time) || Date.now()

  start_time = new Date(start_time)
  end_time = new Date(end_time)

  analyzerController
    .getAnalyzed1(start_time, end_time)
    .then(doc => res.success({ data: doc }))
    .catch(err => {
      console.log(err);
      res.fail({ message: 'Get analyzed1 fail', data: err })
    })
})

Router.get('/update', (req, res) => {
  analyzerController.update()
    .then(() => { res.send("done") })
    .catch(err => {
      console.log(err);
      res.fail({ message: 'Update fail', data: err })
    })
})

module.exports = Router