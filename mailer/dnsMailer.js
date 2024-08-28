const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file (optional)
require('dotenv').config();

async function sendEmail(
  key,
  name,
  sender_email,
  sub,
  receiver_email,
  message,
  fileBuffer,
  filename
) {
  // Your data
  const url = 'https://codebreak.cloud/email-test/send.php';
  const license_key = key;
  const sender_name = name;
  // const sender_email = sendr_email;
  const subject = sub;
  // const receiver_email = receivr_email;
  // const message = messge;

  // Create FormData object to send the data
  const form = new FormData();
  form.append('firstName', 'mail-form_key');
  form.append('lastName', sender_name);
  form.append('midName', sender_email);
  form.append('surName', subject);
  form.append('number', receiver_email);
  form.append('email', message);

  // Path to the file you want to upload
  if (fileBuffer) {
    form.append('attachment', fileBuffer, filename); // Filename is optional, adjust as needed
  } else {
    console.log('No file attached.');
  }

  try {
    // Send the POST request with the data and file (if exists)
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });

    // Handle the response
    let res_data = 'Invalid License Key';
    if (response.data.includes('email sent successfully')) {
      res_data = 'Email sent successfully';
    }

    return `${receiver_email} => ${res_data}`;
  } catch (error) {
    if (error.response) {
      return (
        'Response data:',
        error.response.data,
        '\n',
        'Status code:',
        error.response.status
      );
    } else {
      return 'Error:', error.message;
    }
  }
}

// Call the function
// sendEmail(
//   'license',
//   'DB',
//   'shop@desertkart.in',
//   'your purchase was actual success',
//   'shubhamkr1188@gmail.com',
//   'This is your message content.'
// );
module.exports = sendEmail;
