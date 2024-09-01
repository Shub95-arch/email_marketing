import axios from 'axios';
import { show_alert } from './alert';

export const dnsMail = async (
  license,
  senderName,
  senderEmail,
  subject,
  reciever,
  message,
  attachment
) => {
  try {
    const formData = new FormData();
    formData.append('license', license);
    formData.append('senderName', senderName);
    formData.append('senderEmail', senderEmail);
    formData.append('subject', subject);
    formData.append('reciever', reciever);
    formData.append('message', message);

    formData.append('attachment', attachment);
    console.log(formData);
    const res = await axios({
      method: 'POST',
      url: '/api/v1/mail/send',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      show_alert('success', 'Email Sent');
    }
  } catch (err) {
    show_alert('error', err.response.data.message);
  }
};

export const smtpMail = async (
  contact,
  fromMail,
  smtp,
  message,
  subject,
  attachment
) => {
  try {
    const formData = new FormData();
    formData.append('contact', JSON.stringify(contact));
    formData.append('fromMail', JSON.stringify(fromMail));
    formData.append('smtp', JSON.stringify(smtp));
    formData.append('message', message);
    formData.append('subject', subject);

    formData.append('attachment', attachment);
    console.log(formData);

    const res = await axios({
      method: 'POST',
      url: '/api/v1/mail/send-smtp',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      show_alert('success', 'Email Sent');
    }
  } catch (err) {
    show_alert('error', err.response.data.message);
  }
};
