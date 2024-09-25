const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'voices/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload-audio', upload.single('audio'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
