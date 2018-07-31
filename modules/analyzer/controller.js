const model = require(__dirname + '/model')
const utils = require(__dirname + '/../utils')
const async = require('async')

update = () => {
  getUnparsed('facebook', 'uid')
  .then(data => {
    let filtered = []
    data.map(a => {
      if (filtered.indexOf(a)===-1) {
        filtered.push(a)
      }
    })

    return filtered.map(a => {
      a.uid = utils.parseFbProfile(a.facebook)
      return a
    })
  })
  .then(data => {
    let steps = []
    let full = {}
    let limit = 50

    for (let i = 0; i <= data.length; i+=limit) {
      steps.push(i)
    }

    let temp_data = data.map(a => a.uid).filter(a => a)

    async.eachLimit(steps, 10, (i, cb) => {
      utils.parseFbUsername(temp_data.slice(i, i+limit-1), process.env.token)
        .then(resp => {
          Object.assign(full, resp)
          cb()
        })
        .catch(cb)
    }, err => {
      if (err) {
        console.log(err)
      }

      try {
        data.map(a => {
          if (a.uid !== 'false') {
            if (full[a.uid]) {
              a.uid = full[a.uid].id
            } else {
              a.uid = 'false'
            }
          }

          model.update({_id: a._id}, a).exec()
        })

        console.log(`Updating ${data.length} uids`)
      } catch (e) {
        console.log(e)
      }
    })
  })
  .catch(err => console.log(err.message))

  getUnparsed('inviteBy', 'inviteByUid')
  .then(data => {
    let filtered = []
    data.map(a => {
      if (filtered.indexOf(a)===-1) {
        filtered.push(a)
      }
    })

    return filtered.map(a => {
      a.uid = utils.parseFbProfile(a.facebook)
      return a
    })
  })
  .then(data => {
    let steps = []
    let full = {}
    let limit = 50

    for (let i = 0; i <= data.length; i+=limit) {
      steps.push(i)
    }

    let temp_data = data.map(a => a.inviteByUid).filter(a => a)

    async.eachLimit(steps, 10, (i, cb) => {
      utils.parseFbUsername(temp_data.slice(i, i+limit-1), process.env.token)
        .then(resp => {
          Object.assign(full, resp)
          cb()
        })
        .catch(cb)
    }, err => {
      if (err) {
        console.log(err)
      }

      try {
        data.map(a => {
          if (a.inviteByUid !== 'false') {
            if (full[a.inviteByUid]) {
              a.inviteByUid = full[a.inviteByUid].id
            } else {
              a.inviteByUid = 'false'
            }
          }

          model.update({_id: a._id}, a).exec()
        })

        console.log(`Updating ${data.length} invitor uids`)
      } catch (e) {
        console.log(e)
      }
    })
  })
  .catch(err => console.log(err.message))
}

getUnparsed = (sourceField, resultField) => {
  return model.aggregate([
    {$match: {[resultField]: null}},
    {$project: {[sourceField]: 1}}
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
    }, {
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
    }, {
      $match: {
        "inviteByUid": {
          $nin: ['false', null]
        },
        "uid": {
          $nin: ['false', null]
        }
      }
    }, {
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
    }, {
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
    }, {
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