import { login, logout, signup, verify } from './login';
import { smtp, delSmtp } from './createSmtp';
import { dnsMail, smtpMail } from './mail';
import { updateData } from './updateProfile';

const loginForm = document.querySelector('form.sign-in-form');
const verifyForm = document.querySelector('form.sign-otp-form');
const logoutBtn = document.getElementById('logoutbtn');
const signupForm = document.querySelector('form.sign-up-form');
const smtpForm = document.querySelector('form.smtp-form');
const delSmtpBtn = document.querySelectorAll('.btn-danger');
const sendSpoof = document.querySelector('.form-spoof');
const sendSmtp = document.querySelector('.form-smtp');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const profilePage = document.getElementById('profile-change-form');
const passChangeForm = document.getElementById('password-change-form');

if (loginForm) {
  // console.log('hello trigger');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('sign-in-btn').value = 'Logging In..';
    const email = document.getElementById('log_email').value;
    const password = document.getElementById('log_pass').value;
    // console.log(email, password);
    await login(email, password);
    document.getElementById('sign-in-btn').value = 'Sign In';
  });
}

if (verifyForm) {
  verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('sign-btn').value = 'Verifying';
    const code = document.getElementById('code_verify').value;
    await verify(code);
    document.getElementById('sign-btn').value = 'Sign In';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('sign-up-btn').value = 'Signing Up..';
    const name = document.getElementById('sig_name').value;
    const email = document.getElementById('sig_email').value;
    const password = document.getElementById('sig_pass').value;
    const passwordConf = document.getElementById('sig_conf_pass').value;
    // console.log(email, password);
    await signup(name, email, password, passwordConf);
    document.getElementById('sign-up-btn').value = 'Sign Up';
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
  console.log('hello worl');
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

if (sendSmtp) {
  sendSmtp.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('send_mail_btn').innerText =
      'Email sendout processing... ';

    const smtpDetails = document.getElementById('smtp-server').value;
    const smtp = {};
    [smtp.host, smtp.port, smtp.username, smtp.password] =
      smtpDetails.split('|');

    const fromName = document.getElementById('from-name').value;
    const fromEmail = document.getElementById('from-email').value;
    const recEmail = document.getElementById('to-email').value;
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    const attachment = document.getElementById('attachment').files[0];
    const fromMail = { name: fromName, email: fromEmail };
    const contact = { email: recEmail };
    // console.log(smtp, fromMail, contact, message, subject);
    await smtpMail(contact, fromMail, smtp, message, subject, attachment);
    document.getElementById('send_mail_btn').innerText = 'Send Email';
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    console.log('hello boss');
    console.log(urlParams);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    const nextPage = currentPage + 1;
    urlParams.set('page', nextPage);

    // Redirect to the updated URL
    window.location.search = urlParams.toString();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    console.log('hello boss');
    console.log(urlParams);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    const prevPage = Math.max(currentPage - 1, 1);
    urlParams.set('page', prevPage);

    // Redirect to the updated URL
    window.location.search = urlParams.toString();
  });
}

if (profilePage) {
  profilePage.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    updateData(form, 'data');
  });
}

if (passChangeForm) {
  passChangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('current-password').value;
    const password = document.getElementById('new-password').value;
    const passwordConfirm = document.getElementById('confirm-password').value;
    await updateData(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });
}
