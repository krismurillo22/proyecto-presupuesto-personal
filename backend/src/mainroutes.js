const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({
    ok: true,
    message: 'Main router funcionando 👌'
  });
});

module.exports = router;
