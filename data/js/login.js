import axios from 'axios';
import { show_alert } from './alert';

export const login = async (email, password) => {
  try {
    // console.log(email, password);
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      show_alert('success', 'Logged In');
      window.setTimeout(() => {
        location.assign('/activity');
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    show_alert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      show_alert('success', 'Logging out...');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    show_alert('error', 'Error logging you out');
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      show_alert('success', 'Continue Verify');
      window.setTimeout(() => {
        location.assign('/verify');
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    show_alert('error', err.response.data.message);
  }
};

export const verify = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/verify',
      data: {
        otp: data,
      },
    });
    if (res.data.status === 'success') {
      show_alert('success', 'Verified');
      window.setTimeout(() => {
        location.assign('/activity');
      }, 1500);
    }
  } catch (err) {
    show_alert('error', 'Code is invalid or has expired');
  }
};
