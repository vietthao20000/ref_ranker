const mongoose = require('mongoose')

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
      ref: 'registrations',
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
	}
})

module.exports = mongoose.model('Kids', kidSchema)