const express = require('express');

const router = express.Router();

const userController = require('../contoller/user');

router.post('/signup', userController.signUp);

router.post('/login',userController.login);
router.get('/premiumstatus',userController.checkStatus);

router.get('/', (req, res) => {
    res.sendFile('notfound.html',{root:'views'});
});

// router.get('',userController.usergethomePage);

module.exports = router;
