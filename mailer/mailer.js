const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

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
  async send(template, subject, app, attachments = []) {
    console.log(attachments);
    // if we want to send internal
    //1> Render HTML based on a pug temeplate
    let html;
    if (app === 'internal') {
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        subject,
      });
    } else {
      html = template;
    }

    //2> Define the email options
    for (const recipient of this.to) {
      const filteredAttachments = attachments.filter(
        (attachment) => attachment && attachment.filename && attachment.content
      );
      const mailOptions = {
        from: this.from,
        to: recipient.trim(),
        subject,
        html,
        text: htmlToText.fromString(html),
        attachments: filteredAttachments.length
          ? filteredAttachments
          : undefined,
      };

      await this.newTransport().sendMail(mailOptions);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the secureNET Family!', 'internal');
  }
};
