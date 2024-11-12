const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

const pug = require('pug');
const Queue = require('bull');
const emailQueue = new Queue('emailQueue');

module.exports = class Email {
  constructor(contact, smtp, from) {
    //SMTP is an object which contains. 2> from is also an object that contains from name and email
    this.to = contact.email.split('\n');
    this.firstName = contact.name.split(' ')[0];
    this.from = `${from.name} <${from.email}>`;

    // SMTP Details
    this.host = smtp.host;
    this.port = smtp.port;
    this.username = smtp.username;
    this.pass = smtp.password;
  }
  newTransport() {
    return nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.username,
        pass: this.pass,
      },
    });
  }
  //send the actual mail
  async send(template, subject, app, data, attachments = [], CurrentUser) {
    let html;
    if (app === 'internal') {
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        data,
        subject,
      });
    } else {
      html = template;
    }

    for (const recipient of this.to) {
      const filteredAttachments = attachments.filter(
        (attachment) => attachment && attachment.filename && attachment.content
      );

      const mailOptions = {
        host: this.host,
        port: this.port,
        auth: {
          user: this.username,
          pass: this.pass,
        },
        from: this.from,
        to: recipient.trim(),
        subject,
        html,
        text: htmlToText.fromString(html),
        attachments: filteredAttachments.length
          ? filteredAttachments
          : undefined,
      };
      if (app === 'internal') {
        await this.newTransport().sendMail(mailOptions);
      }

      // Add the email job to the queue
      else {
        await emailQueue.add({
          mailOptions,
          CurrentUser,
        });
      }
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the secureNET Family!', 'internal');
  }
  async sendVerify(otp) {
    await this.send(
      'verification',
      'Email verification code!',
      'internal',
      otp
    );
  }
};
