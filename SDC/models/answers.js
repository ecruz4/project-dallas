const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  answer_id: {type: String, required: true},
  question_id: {type: String, required: true},
  body: {type: String, required: true},
  date_written: {type: String, required: true},
  answerer_name: {type: String, required: true},
  answerer_email: {type: String, required: true},
  reported: {type: Boolean, default: false},
  helpfulness: {type: String, default: "0"},
  photos: {type: Array, required: false}
})

const model = mongoose.model('answers', AnswerSchema);

module.exports = model