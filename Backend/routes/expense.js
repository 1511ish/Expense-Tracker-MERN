const express = require('express');

const router = express.Router();

const expenseController = require('../contoller/expense');
const userAuthentication = require('../middleware/auth');

router.post('/add-expense', userAuthentication.authenticate, expenseController.addExpense);
router.get('/get-expenses', userAuthentication.authenticate,expenseController.getExpenses);
router.put('/update-expense/:id', userAuthentication.authenticate, expenseController.updateExpense);
router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;