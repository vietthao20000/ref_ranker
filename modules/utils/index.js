const url = require('url')
const FB = require('fb')

parseFbProfile = (link) => {
	let pattern = /[a-zA-Z0-9.]+/

	if (!link || link.length < 5) {
		return false
	}

	link = link.toLowerCase()

	if (link.indexOf('facebook.com') === -1 && link.indexOf('fb.com') === -1 && link.indexOf('/') === -1) {
		let matches = pattern.exec(link)
		if (matches && link === matches[0] && matches[0].length >= 5) {
			if (parseInt(link)) {
				return parseInt(link)
			}

			return link
		} else {
			return false
		}
	}

	if (!(link.slice(0,4) === 'http' || link.slice(0,5) === 'https')) {
		link = 'https' + link
	}

	try {
		let parsed = url.parse(link, true)

		if (parsed.query.id && parseInt(parsed.query.id)) {
			return parseInt(parsed.query.id)
		}

		if (parsed.pathname) {
			let username = parsed.pathname.split('/')
			if (username.length > 1) {
				username = username[1]
			} else {
				username = username[0]
			}

			let matches = pattern.exec(username)
			if (matches && matches[0] === username && username.length >= 5) {
				return username
			}
		}
	} catch (e) {
		console.log(e)
	}

	return false
}

parseFbUsername = (ids, access_token) => {
	if (ids.length === 0) {
		return new Promise(cb => cb({}))
	}

	return FB.api('', {ids: ids.join(','), access_token, fields: 'id'})
	.catch(err => {
		if (err.response.error.code === 803) {
			let failed = err.response.error.message.split(': ')[1].trim().split(',')
			let filtered = ids.filter(a => failed.indexOf(a)===-1)
			return parseFbUsername(filtered, access_token)
		}

		throw err
	})
}

module.exports = { parseFbProfile, parseFbUsername }