
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions
router.get('/', transactionController.getAllTransactions);

// GET /api/transactions/user/:userId
router.get('/user/:userId', transactionController.getTransactionsByUserId);

// POST /api/transactions
router.post('/', transactionController.createTransaction);

module.exports = router;
