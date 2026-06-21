const mongoose = require('mongoose');

const QueryLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  queryText: {
    type: String,
    required: true,
    trim: true,
  },
  detected: {
    type: String,
    enum: ['safe', 'vulnerable'],
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  mlScore: {
    type: Number,
    default: null,
  },
  ruleHits: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient per-user queries sorted by date
QueryLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('QueryLog', QueryLogSchema);
