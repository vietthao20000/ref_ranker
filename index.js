require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const analyzerRouter = require(__dirname + '/modules/analyzer')
const analyzerController = require(__dirname + '/modules/analyzer/analyzerController')
const fs = require('fs')
const kidsModel = require(__dirname + '/modules/analyzer/kidsModel')
const bodyParser = require('body-parser')
const utils = require(__dirname + '/modules/utils/')
const mailerRouter = require(__dirname + '/modules/mailer')
const cors = require('cors')

mongoose.connect(process.env.dburi)
	.then(() => {
		console.log('DB connected')

		// controller.update()

		// setInterval(() => {
		// 	controller.update()
		// }, 60*process.env.updateIntervalMinutes*1000)
	})
	.catch(err => {
		console.log(err)
	})

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.success = ({ data, message }) => {
    return res.json({ success: 1, data, message })
  }

  res.fail = ({ data, message }) => {
    return res.json({ success: 0, data, message })
  }

  next()
})

app.use('/', analyzerRouter)

app.use('/', mailerRouter)

app.listen(process.env.port || 3000, () => {
	console.log(`Listening on ${process.env.port}`)
})