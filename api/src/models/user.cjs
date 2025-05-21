const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
  },
  { timestamps: true },
);

module.exports = model('User', UserSchema);
