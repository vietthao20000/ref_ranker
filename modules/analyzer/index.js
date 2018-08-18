const express = require('express')
const Router = express.Router()
const analyzerController = require(__dirname + '/analyzerController')
const rewardConfigRouter = require('./rewardConfigRouter.js')
const analyzerRouter = require('./analyzerRouter.js')

Router.use('/', express.static(__dirname + '/public'))

Router.use('/configs', rewardConfigRouter);

Router.use(analyzerRouter)

module.exports = Router