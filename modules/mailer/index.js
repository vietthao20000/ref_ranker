const Router = require('express').Router()
const mailerController = require(__dirname + '/mailerController')
const utils = require(__dirname + '/../utils')
const controller = require(__dirname + '/../analyzer/controller')
const fs = require('fs')

generateEmail = ({ name, count, reward, next_reward, next_count }) => {
  template = fs.readFileSync(__dirname + '/template.html', 'utf-8')
  email = template
            .replace('{{name}}', name)
            .replace('{{count}}', count)
            .replace('{{reward}}', reward)
            .replace('{{next_reward}}', next_reward)
            .replace('{{next_count}}', next_count)
  return email
}

Router.post('/webhook', (req, res) => {
  data = req.body
  fb_url = data.kid.inviteBy
  username = utils.parseFbProfile(fb_url)
  utils.parseFbUsername([username], process.env.token).then(resp => controller.getAnalyzedForSpecificUser(resp[username].id).then(resp => {
    if (resp && resp.length) {
      invitor = resp[0]

      current_reward = mailerController.get_reward_info(invitor.count)
      next_reward = mailerController.get_reward_info(current_reward.next).reward

      mailerController.send_email({ 
        // to: invitor.mail, 
        to: 'vietthao2000@gmail.com',
        subject: 'Cảm ơn bạn', 
        html_content: generateEmail({
          name: data.kid.name,
          count: invitor.count,
          reward: current_reward.reward,
          next_reward,
          next_count: current_reward.next
        }) 
      })
    }
  }))

  res.json(true)
})

module.exports = Router