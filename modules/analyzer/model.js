const mongoose = require('mongoose')

// let registrationSchema = new mongoose.Schema({
// 	code: {
// 		type: 'Number'
// 	},
// 	utm_campaign: {
// 		type: 'String'
// 	},
// 	utm_medium: {
// 		type: 'String'
// 	},
// 	utm_source: {
// 		type: 'String'
// 	},
// 	depositRecords: {
// 		type: 'Array'
// 	},
// 	history: {
// 		type: [
// 			'Mixed'
// 		]
// 	},
// 	details: {
// 		type: 'Mixed'
// 	},
// 	course: {
// 		type: 'String'
// 	},
// 	kid: {
// 		type: 'String'
// 	},
// 	connectBy: {
// 		type: 'String'
// 	},
// 	method: {
// 		type: 'String'
// 	},
// 	time: {
// 		type: 'Date'
// 	}
// })

let kidSchema = new mongoose.Schema({
	code: {
		type: 'Number'
	},
	experience: {
		type: 'String'
	},
	inviteBy: {
		type: 'String'
	},
	facebook: {
		type: 'String'
	},
	phone: {
		type: 'String'
	},
	mail: {
		type: 'String'
	},
	institude: {
		type: 'String'
	},
	dob: {
		type: 'Date'
	},
	registrations: [
		{
			type:	'ObjectId',
		}
	],
	name: {
		last: {
			type: 'String'
		},
		first: {
			type: 'String'
		}
	},
	inviteByUid: {
		type: 'String'
	},
	uid: {
		type: 'String'
	},
  refEmailsSentCount: {
    type: 'Number'
  }
})

module.exports = mongoose.model('kids', kidSchema)