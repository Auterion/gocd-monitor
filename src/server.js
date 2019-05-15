const express = require('express');
const gocd = require('./gocd');

const PORT = process.env.PORT || 12333;

const app = express();

app.use(express.static('src/static'));

app.get('/status', function (req, res) {
  gocd.getPipelineStatus().then(
    data => res.json(data),
    error => res.status(500).json({error}));
});

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});

