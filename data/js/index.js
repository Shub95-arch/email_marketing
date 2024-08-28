import { login, logout, signup } from './login';
import { smtp, delSmtp } from './createSmtp';
import { dnsMail } from './mail';

const loginForm = document.querySelector('form.login');
const logoutBtn = document.getElementById('logoutbtn');
const signupForm = document.querySelector('form.signup');
const smtpForm = document.querySelector('form.smtp-form');
const delSmtpBtn = document.querySelectorAll('.btn-danger');
const sendSpoof = document.querySelector('.form-container');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('log_email').value;
    const password = document.getElementById('log_pass').value;
    console.log(email, password);
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sig_name').value;
    const email = document.getElementById('sig_email').value;
    const password = document.getElementById('sig_pass').value;
    const passwordConf = document.getElementById('sig_conf_pass').value;
    console.log(email, password);
    signup(name, email, password, passwordConf);
  });
}

if (smtpForm) {
  smtpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const host = document.getElementById('smtp-host').value;
    const port = document.getElementById('smtp-port').value;
    const username = document.getElementById('smtp-username').value;
    const password = document.getElementById('smtp-password').value;
    smtp(host, port, username, password);

    //remove the values
    document.getElementById('smtp-host').value = '';
    document.getElementById('smtp-port').value = '';
    document.getElementById('smtp-username').value = '';
    document.getElementById('smtp-password').value = '';
  });
}

if (delSmtpBtn) {
  delSmtpBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const smtpId = button.getAttribute('data-id');
      delSmtp(smtpId);
    });
  });
}

if (sendSpoof) {
  sendSpoof.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sendButton = document.getElementById('send_mail_btn');
    // console.log(typeof document.getElementById('send_mail_btn').innerHTML);
    sendButton.innerText = 'Sending ...';
    const fromName = document.getElementById('from-name').value;
    const fromEmail = document.getElementById('from-email').value;
    const recEmail = document.getElementById('to-email').value;
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    const attachment = document.getElementById('attachment').files[0];

    console.log(attachment);
    await dnsMail(
      'test__key',
      fromName,
      fromEmail,
      subject,
      recEmail,
      message,
      attachment
    );
    document.getElementById('send_mail_btn').innerText = 'Send Email';
  });
}
