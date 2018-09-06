const Router = require('express').Router()
const mailerController = require(__dirname + '/mailerController')
const utils = require(__dirname + '/../utils')
const analyzerController = require(__dirname + '/../analyzer/analyzerController')
const referralController = require(__dirname + '/../analyzer/referralController')
const fs = require('fs')

generateEmail = ({ name, count, reward, next_reward, next_count, template_path }) => {
  template = fs.readFileSync(template_path, 'utf-8')
  email = template
            .replace('{{name}}', name)
            .replace('{{count}}', count)
            .replace('{{reward}}', reward)
            .replace('{{next_reward}}', next_reward)
            .replace('{{next_count}}', next_count)
  return email
}

Router.post('/webhook', (req, res) => {
  invited = req.body
  if (!invited.kid.inviteBy) return;

  analyzerController.update()
  .then(resp => referralController.addNewRef(invited))
  .then(invitor => {
    if (!invitor) return;

    let ref_count = invitor.referrals.length;

    return mailerController.get_reward_info(ref_count, invitor._id).then(reward => {
      if (!reward) return;
      let { current_reward, next_reward } = reward;

      template_name = current_reward.reward ? '/template2.html' : '/template1.html'
      title = current_reward.reward ? 'BẠN CÓ QUÀ TỪ TECHKIDS !!' : 'Lời cảm ơn đến từ Techkids Coding School'

      if (!invitor.mail) {
        console.log({
          invited,
          invitor
        })
        throw `Can't find email address to send`
      }

      return mailerController.send_email({ 
        to: 'vietthao2000@gmail.com',
        // to: invitor.mail, 
        subject: title, 
        html_content: generateEmail({
          name: invited.kid.name.first+" "+invited.kid.name.last,
          count: ref_count,
          reward: current_reward.reward,
          next_reward: next_reward.reward,
          next_count: next_reward.count,
          template_path: __dirname + template_name
        }) 
      })
    })
    .then(res.success({ data: ref_count }))
  })
  .catch(err => console.log({
    err,
    invited
  }))
})

Router.get('/template1', (req, res) => {
  count = parseInt(req.query.count)
  current_reward = mailerController.get_reward_info(count)
  next_reward = mailerController.get_reward_info(current_reward.next).reward
  res.send(generateEmail({
    name: 'Thao',
    count: count,
    reward: current_reward.reward,
    next_reward,
    next_count: current_reward.next,
    template_path: __dirname + '/template1.html'
  }))
})

Router.get('/template2', (req, res) => {
  count = parseInt(req.query.count)
  current_reward = mailerController.get_reward_info(count)
  next_reward = mailerController.get_reward_info(current_reward.next).reward
  res.send(generateEmail({
    name: 'Thao',
    count: count,
    reward: current_reward.reward,
    next_reward,
    next_count: current_reward.next,
    template_path: __dirname + '/template2.html'
  }))
})

module.exports = Router