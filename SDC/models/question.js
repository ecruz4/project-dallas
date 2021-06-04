const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question_id: {type: String, required: true},
  product_id: {type: String, required: true},
  question_body: {type: String, required: true},
  question_date: {type: String, required: true},
  asker_name: {type: String, required: true},
  asker_email: {type: String, required: true},
  reported: {type: Boolean, default: false},
  question_helpfulness: {type: String, default: "0"}
})

const model = mongoose.model('questions', QuestionSchema);

module.exports = model