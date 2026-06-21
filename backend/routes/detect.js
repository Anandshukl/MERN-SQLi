const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const QueryLog = require('../models/QueryLog');

// ── SQL Injection Detection Engine ─────────────────────

/**
 * Safe SQL patterns — these are whitelisted as benign
 */
const SAFE_SQL_PATTERNS = [
  /^select\s+\*\s+from\s+\w+;?$/i,
  /^select\s+[\w,\s]+\s+from\s+\w+;?$/i,
  /^select\s+count\(\*\)\s+from\s+\w+;?$/i,
  /^select\s+[\w,\s]+\s+from\s+\w+\s+where\s+\w+\s*=\s*\?\s*;?$/i,
  /^insert\s+into\s+\w+\s*\([\w,\s]+\)\s*values\s*\([\w\s,?']+\);?$/i,
  /^update\s+\w+\s+set\s+\w+\s*=\s*\?\s+where\s+\w+\s*=\s*\?\s*;?$/i,
  /^delete\s+from\s+\w+\s+where\s+\w+\s*=\s*\?\s*;?$/i,
];

/**
 * Injection rules — each has a pattern, severity, and explanation
 */
const INJECTION_RULES = [
  {
    pattern: /\bOR\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    severity: 'high',
    message: "Tautology attack detected (e.g., OR 1=1)",
  },
  {
    pattern: /\bOR\b\s+['"][^'"]*['"]\s*=\s*['"][^'"]*['"]/i,
    severity: 'high',
    message: "String tautology detected (e.g., OR 'a'='a')",
  },
  {
    pattern: /--\s*$/m,
    severity: 'medium',
    message: "SQL line comment '--' detected at end of input",
  },
  {
    pattern: /;\s*\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC|SHUTDOWN)\b/i,
    severity: 'critical',
    message: 'Stacked query with destructive command detected',
  },
  {
    pattern: /\bUNION\b\s+(\bALL\b\s+)?\bSELECT\b/i,
    severity: 'high',
    message: 'UNION SELECT injection pattern detected',
  },
  {
    pattern: /\bDROP\b\s+\bTABLE\b/i,
    severity: 'critical',
    message: 'DROP TABLE command detected',
  },
  {
    pattern: /\bSLEEP\s*\(\s*\d+\s*\)/i,
    severity: 'high',
    message: 'Time-based blind injection (SLEEP) detected',
  },
  {
    pattern: /\bWAITFOR\b\s+\bDELAY\b/i,
    severity: 'high',
    message: 'MSSQL time-based injection (WAITFOR DELAY) detected',
  },
  {
    pattern: /\bBENCHMARK\s*\(/i,
    severity: 'high',
    message: 'MySQL BENCHMARK-based timing attack detected',
  },
  {
    pattern: /(['"]).*?\1\s*--/i,
    severity: 'medium',
    message: "String literal followed by comment ('...' --) pattern detected",
  },
  {
    pattern: /\/\*.*?\*\//i,
    severity: 'low',
    message: 'Inline block comment (/* */) obfuscation detected',
  },
  {
    pattern: /\b(EXEC|EXECUTE)\s*\(/i,
    severity: 'critical',
    message: 'Dynamic SQL execution (EXEC/EXECUTE) detected',
  },
  {
    pattern: /\bINFORMATION_SCHEMA\b/i,
    severity: 'high',
    message: 'Information schema enumeration attempt detected',
  },
  {
    pattern: /\bLOAD_FILE\s*\(/i,
    severity: 'critical',
    message: 'File read attempt (LOAD_FILE) detected',
  },
  {
    pattern: /\bINTO\s+(OUT|DUMP)FILE\b/i,
    severity: 'critical',
    message: 'File write attempt (INTO OUTFILE/DUMPFILE) detected',
  },
  {
    pattern: /@@(version|datadir|hostname|basedir)/i,
    severity: 'medium',
    message: 'Server variable enumeration (@@version etc.) detected',
  },
];

/**
 * Check if query matches safe SQL allowlist
 */
function isSafeSql(query) {
  const q = query.trim();
  return SAFE_SQL_PATTERNS.some((regex) => regex.test(q));
}

/**
 * Run all injection rules against query
 */
function runRuleEngine(query) {
  const hits = [];
  for (const rule of INJECTION_RULES) {
    if (rule.pattern.test(query)) {
      hits.push({
        message: rule.message,
        severity: rule.severity,
      });
    }
  }
  return hits;
}

/**
 * Calculate a pseudo ML confidence score from rule hits
 */
function calculateConfidence(hits) {
  if (hits.length === 0) return 0.0;

  const severityWeights = { critical: 0.95, high: 0.8, medium: 0.6, low: 0.3 };
  let maxWeight = 0;
  let totalWeight = 0;

  for (const hit of hits) {
    const w = severityWeights[hit.severity] || 0.5;
    maxWeight = Math.max(maxWeight, w);
    totalWeight += w;
  }

  // Combine max severity with cumulative signal
  const combined = maxWeight * 0.7 + Math.min(totalWeight / hits.length, 1) * 0.3;
  return Math.min(combined, 0.99);
}

// ──────────────────────────────────────────────────────
// @route   POST /api/detect
// @desc    Analyze a SQL query for injection patterns
// @access  Private
// ──────────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const q = query.trim();
    let result;

    // Step 1: Check safe allowlist
    if (isSafeSql(q)) {
      result = {
        detected: 'safe',
        explanation: 'This query matches a known safe SQL pattern. No injection indicators found.',
        ml_score: 0.02,
        ruleHits: [],
      };
    } else {
      // Step 2: Run rule-based engine
      const hits = runRuleEngine(q);

      if (hits.length > 0) {
        const confidence = calculateConfidence(hits);
        result = {
          detected: 'vulnerable',
          explanation: hits.map((h) => `⚠️ ${h.message} (${h.severity})`).join('\n'),
          ml_score: confidence,
          ruleHits: hits.map((h) => h.message),
        };
      } else {
        result = {
          detected: 'safe',
          explanation: 'No known SQL injection patterns detected. The query appears benign.',
          ml_score: 0.08,
          ruleHits: [],
        };
      }
    }

    // Step 3: Log to MongoDB
    try {
      const newLog = new QueryLog({
        userId: req.user.id,
        queryText: q,
        detected: result.detected,
        explanation: result.explanation,
        mlScore: result.ml_score,
        ruleHits: result.ruleHits,
      });
      await newLog.save();
    } catch (logErr) {
      console.error('Failed to save query log:', logErr.message);
    }

    return res.json(result);
  } catch (err) {
    console.error('Detection error:', err.message);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// ──────────────────────────────────────────────────────
// @route   GET /api/detect/history
// @desc    Get last 10 scan logs for the authenticated user
// @access  Private
// ──────────────────────────────────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const logs = await QueryLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json(logs);
  } catch (err) {
    console.error('History error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch scan history' });
  }
});

// ──────────────────────────────────────────────────────
// @route   GET /api/detect/stats
// @desc    Get scan statistics for the authenticated user
// @access  Private
// ──────────────────────────────────────────────────────
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await QueryLog.countDocuments({ userId: req.user.id });
    const vulnerable = await QueryLog.countDocuments({ userId: req.user.id, detected: 'vulnerable' });
    const safe = total - vulnerable;

    res.json({
      totalScans: total,
      vulnerableCount: vulnerable,
      safeCount: safe,
      detectionRate: total > 0 ? ((vulnerable / total) * 100).toFixed(1) : '0.0',
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch stats' });
  }
});

module.exports = router;
