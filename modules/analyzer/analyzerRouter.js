const express = require('express')
const Router = express.Router()

Router.get('/getAnalyzed', (req, res) => {
  let start_time = parseInt(req.query.start_time) || 0
  let end_time = parseInt(req.query.end_time) || Date.now()

  start_time = new Date(start_time)
  end_time = new Date(end_time)

  analyzerController
    .getAnalyzed(start_time, end_time)
    .then(doc => res.success({ data: doc }))
})

Router.get('/update', (req, res) => {
  analyzerController.update().then(() => { res.send("done") })
})

module.exports = Router