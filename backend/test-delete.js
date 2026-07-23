const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 1, email: 'admin@webdin.com', role: 'admin' },
  'UAS_WEBDIN_RAHASIA_SUPER_AMAN_2026', // Dari .env
  { expiresIn: '24h' }
);

fetch('http://localhost:3000/api/peserta/1', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(console.log)
.catch(console.error);
