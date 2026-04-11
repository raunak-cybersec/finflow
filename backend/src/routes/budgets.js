const express = require('express');
const router = express.Router();
const { getBudgets, upsertBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getBudgets);
router.put('/', upsertBudget);

module.exports = router;
