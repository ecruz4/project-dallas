const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


//Make call to connect to MongoDB:
mongoose.connect('mongodb://mongo:27017/SDC_Complete', { useNewUrlParser: true, useUnifiedTopology: true });

//Import Models:
const questions = require('./models/question');
const answers = require('./models/answers');

//Connect to DB
const db = mongoose.connection;
db.on('error', () => {
  console.log('error connecting')
});
db.once('open', () => {
  console.log('connected to mongodb')
})


//Start app and apply middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;


//Routes:
//Get Questions:
//GET "/qa/${id}"
  //Return questions and answers for that product
  //Parameters:
    //product_id
    //page - default 1
    //count - default 5
app.get('/qa/:product_id', (req, res) => {
  questions.aggregate([{
    $match: {
      product_id: req.params.product_id
    }}, {
    $lookup: { 
      from: 'answers',
      localField: 'id',
      foreignField: 'question_id',
      as: 'answers'
    }
  }])
  .exec((err, data) => {
    if (err) {
        res.status(400).json(`Error querying DB: ${err}`);
    }
    // console.log(data);
    res.status(200).json({
      product_id: req.params.product_id,
      results: data});
  })
})


//Get Specific Answers:
//GET "/qa/${question_id}/answers"
  //Return answers for that question
  //Parameters:
    //question_id
    //page - default 1
    //count - default 5
app.get('/qa/questions/:question_id/answers', (req, res) => {
  answers.find({ question_id: req.params.question_id, reported: false })
    .exec((err, data) => {
      if (err) {
        res.status(400).json(`Error querying DB: ${err}`);
      }
      res.status(200).json(data);
    })
})


//Add a Question:
//POST "/qa/questions"
  //Post a question to the db, response: "Status: 201 CREATED"
  //Body Parameters:
    //body - text
    //name - text
    //email - text
    //product_id - the ID of the product for which question is posted
app.post('/qa/:product_id', (req, res) => {
  console.log(req.params);
  console.log(req.body)
  // questions.create({
  //   question_id: uuid(),
  //   product_id: req.params.product_id,
  //   question_body: req.body.body,
  //   question_date: new Date()
  // })
})


//Add an Answer:
//POST "/qa/questions/:question_id/answers"
  //Post an answer to the db for a specific question, response: "Status: 201 CREATED"
  //Parameters:
    //question_id
  //Body Parameters:
    //body - text
    //name - text
    //email - text
    //photo_urls - array of text/urls
app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log(req.params);
  console.log(req.body);
})


//Mark Question as Helpful:
//PUT "/qa/questions/:question_id/helpful"
//response: "Status: 204 NO CONTENT";
  //Parameters: 
    //question_id
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  questions.find({ question_id: req.params.question_id })
    .exec((err, data) => {
      if (err) {
        res.status(400).json(`Error querying DB: ${err}`);
      }
      questions.findOneAndUpdate({question_id: req.params.question_id}, {$set: {question_helpfulness: (Number(data[0].question_helpfulness) + 1).toString()}}, {new: true}, (err, doc) => {
        if (err) {
          console.log(`Error updating DB: ${err}`)
        }
        res.status(204).json('NO CONTENT');
      })
    })
})

//Report a Question:
//PUT "/qa/questions/:question_id/report"
//response: "Status: 204 NO CONTENT"
  //Parameters: 
    //question_id
app.put('/qa/questions/:question_id/report', (req, res) => {
  questions.findOneAndUpdate({question_id: req.params.question_id }, {$set: {reported: true}}, {new: true}, (err, doc) => {
    if (err) {
      console.log(`Error Making Update to DB: ${err}`)
      res.status(400).json('Could not update DB');
    } else {
      res.status(204).json('NO CONTENT')
    }
  })
})

//Mark Answer as Helpful:
//PUT "/qa/answers/:answer_id/helpful"
//response: "Status: 204 NO CONTENT"
  //Parameters:
    //answer_id
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  answers.find({ answer_id: req.params.answer_id })
    .exec((err, data) => {
      if (err) {
        res.status(400).json(`Error querying DB: ${err}`);
      }
      answers.findOneAndUpdate({answer_id: req.params.answer_id}, {$set: {helpfulness: (Number(data[0].helpfulness) + 1).toString()}}, {new: true}, (err, doc) => {
        if (err) {
          console.log(`Error updating DB: ${err}`)
        }
        res.status(204).json('NO CONTENT');
      })
    })
})

//Report an Answer:
//PUT "/qa/answers/:answer_id/report"
//response: "Status: 204 NO CONTENT"
  //Parameters:
    //answer_id
app.put('/qa/answers/:answer_id/report', (req, res) => {
  answers.findOneAndUpdate({answer_id: req.params.answer_id}, {$set: {reported: true}}, {new: true}, (err, doc) => {
    if (err) {
      console.log(`Error making update to DB: ${err}`);
      res.status(400).json('Could not update DB')
    }
    res.status(204).json('NO CONTENT')
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
