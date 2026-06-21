const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET /api/profile
// @desc    Get team and institute profile details
// @access  Private
router.get('/', auth, (req, res) => {
  res.json({
    team: 'ABCD',
    institute: 'Acropolis Institute of Technology and Research',
    students: [
      { name: 'Anand Shukla', id: '0827CY231010' },
      { name: 'Dhruv Jadhav', id: '0827CY231021' },
    ],
    guided_by: 'Guided By:- Prof. Ashwinee Gadwal',
  });
});

module.exports = router;
