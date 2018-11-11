const express = require('express');
const fileUpload = require('./lib/index.js');
const app = express();
const vision = require('@google-cloud/vision');
var client;

app.use('/form', express.static(__dirname + '/index.html'));

// default options
app.use(fileUpload());

app.get('/', (req, res) => {
    /*res.status(200).send('Hello, world!').end();
    console.log("Running")
    client
    .labelDetection('swap.jpg')
    .then(results => {
      const labels = results[0].labelAnnotations;
  
      console.log('Labels:');
      labels.forEach(label => console.log(label.description));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });*/
    res.status(200).send('Hello, world!').end();
    getData('swap.jpg')
  });

function getData(fileName) {
    client = new vision.ImageAnnotatorClient()
    console.log("Running 2")
    client
    .labelDetection(fileName.data)
    .then(results => {
      const labels = results[0].labelAnnotations;
  
      console.log('Labels:');
      labels.forEach(label => console.log(label.description));
      console.log(results)
    })
    .catch(err => {
      console.error('ERROR:', err);
      //console.log(fileName)
    });
}

function detectFaces(inputFile, callback) {
    client = new vision.ImageAnnotatorClient()
    // Make a call to the Vision API to detect the faces
    //const request = {content: inputFile.data};
    //const request = {image: {source: {filename: "uploads/kyleleeheadiconimage234567.jpg"}}};
    console.log(inputFile.data)
    client
      .faceDetection(inputFile.data)
      .then(results => {
        const faces = results[0].faceAnnotations;
        const numFaces = faces.length;
        console.log('Found ' + numFaces + (numFaces === 1 ? ' face' : ' faces'));
        console.log(faces)
        callback(null, faces);
      })
      .catch(err => {
        console.error('ERROR:', err);
        callback(err);
      });
  }

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (Object.keys(req.files).length == 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  //console.log('req.files >>>', req.files); // eslint-disable-line

  var image = req.files.image;
  uploadPath = __dirname + '/uploads/' + image.name;

  image.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded to ' + uploadPath);
  });
  console.log("Running 1")
  //getData('./uploads/' + image.name)
  //getData(image)
  detectFaces(image, () => console.log("Completed"))
});

app.listen(8000, function() {
  console.log('Express server listening on port 8000'); // eslint-disable-line
});
