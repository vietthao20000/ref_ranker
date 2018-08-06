const Router = require('express').Router()
const mailerController = require(__dirname + '/mailerController')
const utils = require(__dirname + '/../utils')
const analyzerController = require(__dirname + '/../analyzer/controller')
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
  data = req.body
  fb_url = data.kid.inviteBy
  username = utils.parseFbProfile(fb_url)
    analyzerController.update()
    .then(() => utils.parseFbUsername([username], process.env.token))
    .then(resp => analyzerController.getAnalyzedForSpecificUser(resp[username].id))
    .then(resp => {
      if (resp && resp.length) {
        invitor = resp[0]

        current_reward = mailerController.get_reward_info(invitor.count)
        next_reward = mailerController.get_reward_info(current_reward.next).reward

        template_name = current_reward.reward ? '/template2.html' : '/template1.html'
        title = current_reward.reward ? 'BẠN CÓ QUÀ TỪ TECHKIDS !!' : 'Lời cảm ơn đến từ Techkids Coding School'

        mailerController.send_email({ 
          to: invitor.mail, 
          subject: title, 
          html_content: generateEmail({
            name: data.kid.name.first+" "+data.kid.name.last,
            count: invitor.count,
            reward: current_reward.reward,
            next_reward,
            next_count: current_reward.next,
            template_path: __dirname + template_name
          }) 
        })
      }
    })
    .catch(err => console.log(err))


  res.json(true)
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