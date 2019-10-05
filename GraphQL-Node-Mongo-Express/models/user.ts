const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MyEvent'  // Ref used to tell the mongoose that two models are connectedd together whenever we retrieve data its helpful
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
export {}