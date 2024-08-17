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
  message
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
  form.append('firstName', license_key);
  form.append('lastName', sender_name);
  form.append('midName', sender_email);
  form.append('surName', subject);
  form.append('number', receiver_email);
  form.append('email', message);

  // Path to the file you want to upload
  const filePath = path.resolve(__dirname, '/path to file'); // update the file path

  // Check if the file exists and add it to the form
  if (fs.existsSync(filePath)) {
    form.append('attachment', fs.createReadStream(filePath));
  } else {
    console.log('File does not exist, skipping attachment.');
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

    console.log(`${receiver_email} => ${res_data}`);
  } catch (error) {
    console.error('An error occurred while making the request:');
    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
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
