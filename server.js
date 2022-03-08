const express = require('express')
const app = express();
var cors = require('cors');
var path = require('path');
const port = 4000;
var compression = require('compression');
var multer  = require('multer')
var fs= require('fs')

var user = require(path.join(__dirname, '/routes/user'));
var candidate = require(path.join(__dirname, '/routes/candidate'));

db = require(path.join(__dirname,'/config/mongoose'));

app.use(compression())
app.use(cors());

app.use(function(req,res,next){
  res.setHeader('Access-Control-Max-Age',0);
  res.setHeader('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0,must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires','-1')
  return next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'build')));
//app.use(express.static(path.join(__dirname, 'build/index.html')));

app.use('/api/user', user);
app.use('/api/candidate', candidate);

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log("username",req.body)
      try {
        var directoryPath="./uploads/"+req.body.username;
        fs.mkdirSync(directoryPath, { recursive: true })
        callback(null, directoryPath)
      } catch (err) {
        if (err.code !== 'EEXIST') callback(err,null)
      }
    
  },
  filename: function (req, file, callback) {
    callback(null, req.body.filename + '-' + Date.now())
  }
})
var upload = multer({ storage: Storage }).single('test')


app.post('/upload', function (req, res) {
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400).json({success:false,"message":err})
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(400).json({success:false,"message":err})
    }
    console.log("username",req.body.username)
    res.status(200).json({success:true,"message":req.file})
    // Everything went fine.
  })

  });



  app.get('/uploads/documents/:fileName', function (req, res, next) {
    //var origPath=req.params.
    //res.send("hello"+__dirname)
  res.sendFile(path.resolve('uploads/documents/'+req.params.fileName));
  });

  

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });



/*var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./comments.html', 'utf8');
var html1=html.replace(/#carsArray/g,'abc,def,ghf');
var options = { format: 'Letter' };

pdf.create(html1, options).toFile('./businesscard.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});*/



  
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
