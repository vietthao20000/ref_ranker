const model = require(__dirname + '/model')
const utils = require(__dirname + '/../utils')
const async = require('async')
const _ = require('lodash')

getUnparsed = (sourceField, resultField) => {
  return model.aggregate([
    {$match: {[resultField]: null}},
    {$project: {[sourceField]: 1}}
  ])
}

updateField = (sourceField, resultField) => {
  // Lấy những user chưa được parse FB link thành uid
  return getUnparsed(sourceField, resultField)
  .then(data => {
    // Lọc trùng
    let filtered = _.uniq(data)

    // Parse link FB thành username
    return filtered.map(user => {
      user[resultField] = utils.parseFbProfile(user[sourceField])
      return user
    })
  })
  .then(data => {
    let steps = []
    let full = {}
    let limit = 50

    for (let i = 0; i <= data.length; i+=limit) {
      steps.push(i)
    }

    let uids = data.map(user => user[resultField]).filter(uid => uid)

    // Chia ra thành các chunks 50 element để request cho nhanh và khỏi bị limit
    let chunks = _.chunk(uids, 50)

    // Request 10 chunks một lúc
    return new Promise((resolve, reject) => {
      async.eachLimit(
        chunks, 10, 
        (chunk, cb) => {
          // Parse username thành uid
          utils.parseFbUsername(chunk, process.env.token)
            .then(resp => {
              full = {...full, ...resp}
              cb()
            })
            .catch(cb)
        }, (err) => {
          if (err) {
            console.log(err.message)
          }

          console.log(`Updating ${data.length} ${resultField}`)

          return async.each(data, (user, cb) => {
            let update_data = {[resultField]: full[user[resultField]] ? full[user[resultField]].id : 'false'}
            model.update({_id: user._id}, {$set: update_data}).exec(cb)
          }, (err, data) => {
            if (err) reject(err)
            resolve(data) 
          })
        }
      )
    })
  })
  .catch(err => console.log(err.message))
}

update = () => {
  return Promise.all([
    updateField('facebook', 'uid'),
    updateField('inviteBy', 'inviteByUid')
  ])
}

getAnalyzed = (start_time, end_time) => {
  if (!start_time) {
    start_time = new Date(0)
  }

  if (!end_time) {
    end_time = new Date()
  }

  return model.aggregate([
    {
      $lookup: {
        from: "registrations",
        localField: "registrations",
        foreignField: "_id",
        as: "registrations"
      }
    }, 
    {
      $match: {'registrations.details.admissionState.state': {$ne: 'km-menu-filterbar-admissionStatus-notyet'}}
    },
    {
      $match: {
        $and: [{
          'registrations.time': {
            $gte: start_time
          }
        }, {
          'registrations.time': {
            $lte: end_time
          }
        }]
      }
    }, 
    {
      $match: {
        "inviteByUid": {
          $nin: ['false', null]
        },
        "uid": {
          $nin: ['false', null]
        }
      }
    },
    {
      $project: {
        name: 1,
        facebook: 1,
        phone: 1,
        uid: 1,
        mail: 1,
        inviteByUid: 1,
        same: { $cmp: ['$inviteByUid', '$uid'] }
      }
    },
    {
      $match: {
        same: { $ne: 0 }
      }
    },
    {
      $lookup: {
        from: "kids",
        localField: "inviteByUid",
        foreignField: "uid",
        as: "invitor"
      }
    },
    {
      $project: {
        invitor: { $slice: ['$invitor', 1] },
        name: 1,
        facebook: 1,
        phone: 1,
        uid: 1,
        mail: 1,
      }
    },
    {
      $unwind: "$invitor"
    }, {
      $group: {
        _id: "$invitor.uid",
        count: {
          $sum: 1
        },
        full: {
          $push: "$$ROOT"
        },
        invitorInfo: {
          $first: "$invitor"
        }
      }
    }, 
    {
      $project: {
        name: '$invitorInfo.name',
        facebook: '$invitorInfo.facebook',
        phone: '$invitorInfo.phone',
        uid: '$invitorInfo.uid',
        mail: '$invitorInfo.mail',
        count: 1,
        _id: 0,
        full: {
          name: 1,
          facebook: 1,
          phone: 1,
          uid: 1,
          mail: 1,
          // registrations: 1
        }
      }
    }, 
    {
      $sort: {
        count: -1
      }
    }
  ])
}

getAnalyzedForSpecificUser = (uid) => {
  return getAnalyzed().then(a => a.filter(b => b.uid === uid))
}

getUnsent = () => {
  return getAnalyzed().then(res => {
    unsent = res.filter(a => JSON.stringify((!a.refEmailsSentCount || a.refEmailsSentCount < a.count)))
  })
}

// getUnsent().then(res => console.log(res))

module.exports = { getUnparsed, update, getAnalyzed, getUnsent, getAnalyzedForSpecificUser }