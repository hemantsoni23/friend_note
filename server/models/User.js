const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  interests: {
    type: [String],
  },
  avatarIndex: {
    type: Number, 
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);