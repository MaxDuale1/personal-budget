// Budget API
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

app.get('/budget', (req, res) => {
  const file = path.join(__dirname, 'budget.json');
  fs.readFile(file, 'utf8', (err, text) => {
    if (err) {
      console.error('Failed to read budget.json:', err);
      return res.status(500).json({ error: 'Failed to load budget data' });
    }
    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (e) {
      console.error('Invalid JSON in budget.json:', e);
      res.status(500).json({ error: 'Invalid budget data' });
    }
  });
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
