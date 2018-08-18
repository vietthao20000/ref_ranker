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

module.exports = mongoose.model('Kids', kidSchema)