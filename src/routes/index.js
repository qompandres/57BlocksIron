const express = require('express');
const router = express.Router();

router.get('/star', (req, res) => {
    res.render('index');
});
module.exports = router;