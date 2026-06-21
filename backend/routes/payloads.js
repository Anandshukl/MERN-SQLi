const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

// Cache payloads in memory for performance
let payloadsCache = null;
let cacheLoadTime = null;

// @route   GET /api/payloads
// @desc    Get educational SQL injection payloads library
// @access  Private
router.get('/', auth, (req, res) => {
  const jsonPath = path.join(__dirname, '..', '..', 'data', 'sqli_payloads.json');

  // Check if cache is valid (reload every 5 minutes)
  if (payloadsCache && cacheLoadTime && Date.now() - cacheLoadTime < 5 * 60 * 1000) {
    return res.json(payloadsCache);
  }

  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error loading payloads JSON:', err.message);
      console.error('   Expected file path:', jsonPath);
      return res.status(500).json({ 
        error: 'Failed to load payloads library',
        categories: [] 
      });
    }
    try {
      const payloads = JSON.parse(data);
      
      // Validate structure
      if (!Array.isArray(payloads.categories)) {
        throw new Error('Invalid payloads structure: categories is not an array');
      }

      // Cache the payloads
      payloadsCache = payloads;
      cacheLoadTime = Date.now();
      
      console.log(`✅ Payloads loaded: ${payloads.categories.length} categories`);
      res.json(payloads);
    } catch (parseErr) {
      console.error('❌ Error parsing payloads JSON:', parseErr.message);
      res.status(500).json({ 
        error: 'Failed to parse payloads library',
        categories: [] 
      });
    }
  });
});

// @route   GET /api/payloads/health
// @desc    Check if payloads library is accessible
// @access  Public
router.get('/health', (req, res) => {
  const jsonPath = path.join(__dirname, '..', '..', 'data', 'sqli_payloads.json');
  
  fs.access(jsonPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Payloads file not found',
        path: jsonPath
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Payloads library is accessible'
    });
  });
});

module.exports = router;
