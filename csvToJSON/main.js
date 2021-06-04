const csv = require('csv-parser');
const fs = require('fs');
const csvToJSON = require('csvtojson');
const results = [];

var readQuestionStream = fs.createReadStream('questions.csv');
// var readAnswerStream = fs.createReadStream('answers.csv');
// var readPhotoStream = fs.createReadStream('answers_photos.csv');

var writeQuestionStream = fs.createWriteStream('transformed_questions.json');
// var writeAnswerStream = fs.createWriteStream('transformed_answers.json');
// var writePhotoStream = fs.createWriteStream('transformed_answers_photos.json');

writeQuestionStream.write('[');
// writeAnswerStream.write('[');
// writePhotoStream.write('[');

//Questions Transformation:
readQuestionStream
  .pipe(csv({}))
  .on('data', (data) => {
    //make an array of data keys: if keys.length does not equal headers.length, just return
    if (Object.keys(data).length === 8) {
      if (data.date_written.length === 13) {
        let milliseconds = parseInt(data.date_written);
        data.date_written = (new Date(milliseconds));
      };
      // data.answers = [];
      writeQuestionStream.write(JSON.stringify(data, null, 2) + ',');
    }
  })
  .on('end', () => {
    writeQuestionStream.write(']');
    console.log('Completed transformation');
  })

  //Answers Transformation:
  readAnswerStream
  .pipe(csv({}))
  .on('data', (data) => {
    //make an array of data keys: if keys.length does not equal headers.length, just return
    if (Object.keys(data).length === 8) {
      if (data.date_written.length === 13) {
        let milliseconds = parseInt(data.date_written);
        data.date_written = (new Date(milliseconds));
      };
      data.photo_urls = [];
      writeAnswerStream.write(JSON.stringify(data, null, 2) + ',');
    }
  })
  .on('end', () => {
    writeAnswerStream.write(']');
    console.log('Completed transformation');
  })

  // //Answers_Photos Transformation
  // readPhotoStream
  // .pipe(csv({}))
  // .on('data', (data) => {
  //   //make an array of data keys: if keys.length does not equal headers.length, just return
  //   if (Object.keys(data).length === 3) {
  //     writePhotoStream.write(JSON.stringify(data, null, 2) + ',');
  //   }
  // })
  // .on('end', () => {
  //   writePhotoStream.write(']');
  //   console.log('Completed transformation');
  // })
