import axios from 'axios';
import { show_alert } from './alert';

export const smtp = async (host, port, username, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/smtp',
      data: {
        host,
        port,
        username,
        password,
      },
    });
    if ((res.data.status = 'success')) {
      show_alert('success', 'Smtp Added');
      location.reload(true);
    }
  } catch (err) {
    show_alert('error', err);
  }
};

export const delSmtp = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/smtp/${id}`,
    });

    show_alert('success', 'Smtp deleted');
    location.reload(true);
  } catch (err) {
    show_alert('error', err);
  }
};
