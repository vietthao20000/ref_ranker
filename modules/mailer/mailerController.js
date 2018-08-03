const nodemailer = require('nodemailer')
const fs = require('fs')

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

get_reward_info = (count) => {
  reward_data = JSON.parse(fs.readFileSync(__dirname + '/reward_data.json', 'utf-8'))
  if (count > 10) {
    reward = reward_data[11];
    reward.next = parseInt(count + 1);
    return reward;
  }
  reward = reward_data[count]

  if (reward)
    return reward;
  return reward[reward.next]
}

module.exports = { get_reward_info, send_email }