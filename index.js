require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const analyzerRouter = require(__dirname + '/modules/analyzer')
const controller = require(__dirname + '/modules/analyzer/controller')
const fs = require('fs')
const model = require(__dirname + '/modules/analyzer/model')
const bodyParser = require('body-parser')
const utils = require(__dirname + '/modules/utils/')
const mailerRouter = require(__dirname + '/modules/mailer')

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

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/', analyzerRouter)

app.use('/', mailerRouter)

app.listen(process.env.port || 3000, () => {
	console.log(`Listening on ${process.env.port}`)
})