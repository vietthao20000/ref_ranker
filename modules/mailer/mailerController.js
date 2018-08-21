const nodemailer = require('nodemailer')
const fs = require('fs')
const referralModel = require(__dirname + '/../analyzer/referralModel.js');

config = {
  service: 'gmail',
  auth: {
    user: process.env.gmail_email,
    pass: process.env.gmail_password
  }
}

transporter = nodemailer.createTransport(config)

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

send_email = ({ to, subject, html_content }) => {
  return new Promise((resolve, reject) => {
    message = {
      from: process.env.gmail_email,
      to,
      subject,
      html: html_content
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
          reject(error)
      }

      resolve({id: info.messageId});
    });
  })
}

get_reward_info = (count, invitor_id) => {
  return referralModel.findOne({_id: invitor_id}).lean()
    .then(reward_data => reward_data.config.config)
    .then(reward_data => {
      reward_data = reward_data.sort((a, b) => a.count - b.count);

      current_reward = reward_data.filter(r => r.count === count);
      if (!current_reward || !current_reward.length) {
        if (reward_data[reward_data.length - 1].count < count) return null;

        current_reward = {
          count,
          reward: null
        };
      } else {
        current_reward = current_reward[0];
      }

      next_reward = reward_data.filter(r => r.count > count).sort((a,b) => a.count - b.count);
      if (!next_reward || !next_reward.length) {
        next_reward = {
          count: count + 1,
          reward: 'đặc biệt'
        };
      }
      else next_reward = next_reward[0];

      return { current_reward, next_reward }
    })
}

module.exports = { get_reward_info, send_email }