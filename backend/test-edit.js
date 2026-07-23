const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 1, email: 'admin@webdin.com', role: 'admin' },
  'rahasia_negara_super_kuat_123',
  { expiresIn: '24h' }
);

fetch('http://localhost:3000/api/peserta/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    kegiatan_id: 1,
    nama: 'Budi Santoso Edited',
    email: 'budi@mahasiswa.com',
    no_hp: '081234567890',
    status_pendaftaran: 'hadir'
  })
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(console.log)
.catch(console.error);
