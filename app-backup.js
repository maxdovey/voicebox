const express = require('express')
var createError = require('http-errors');
const app = express()
const bodyParser = require('body-parser');
const path = require('path')
const {spawn, ChildProcess} = require('child_process')
const http = require("http")
const server = http.createServer(app);
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
var multer  = require('multer');
const ftp = require("basic-ftp")

const VIEWS_DIR = "views"
const PUBLIC_DIR = "public"
const PORT = 9000
const SCRIPT_PATH = "/home/max/Documents/pinter-local/voice-clone-cpu/Real-Time-Voice-Cloning/cli-clone-run.py"
const Audio_Files = "/home/max/Documents/pinter-local/voice-clone-cpu/Real-Time-Voice-Cloning/generated-outputs"
const Remote_Server = "headroom.pzwart.wdka.hro.nl:~/public_html/audio-library/media/"

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//routed from submit form to run the python script via runScript()

app.get('/process_get', function (req, res) {
    text_Entry = (req.query.text_Entry);
    console.log(text_Entry);
    const scriptProcess = runScript(text_Entry);
    // res.set('Content-Type', 'text/plain');
    // scriptProcess.stderr.pipe(res)
    // scriptProcess.stderr.pipe(res)
    // print output of script
    scriptProcess.stdout.on('data', (data) => {
      console.log(`data:${data}`);
    });
    scriptProcess.stderr.on('data', (data) => {
      console.log(`error:${data}`);
    });
    scriptProcess.on('close', () => {
      console.log("Closed");
      // next();
    });
  },
  function (req,res) {
    upload_Audio();
    res.sendFile(path.join(__dirname + '/public/index.html'));
  })



// setup multer settings for saving file to disk
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../input-samples');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

// var upload = multer({ dest: __dirname + '/public/uploads/' });
var upload = multer({ storage: storage })
var type = upload.single('upl');

app.post('/api/test', type, function (req, res) {
   console.log(req.body);
   console.log(req.file);
   var originalFileName = req.file.originalname;
   console.log(originalFileName);
   //write file to server here
   // do stuff with file
});



/**
 * @param param {String}
 * @return {ChildProcess}
 */
function runScript(text_Entry) {
  /*
  python -u script.py --foo bar
  */
  return spawn('/home/max/Documents/pinter-local/voice-clone-cpu/bin/python', [
    "-u", SCRIPT_PATH,
    "-t", text_Entry,
  ]);
}


//This function uploads the generated audio file from 'Generated outputs' folder on the local directory and uploads it to a server using SSH
function upload_Audio() {
  try {
  require('child_process').execSync(
  'rsync -azP /home/max/Documents/pinter-local/voice-clone-cpu/Real-Time-Voice-Cloning/generated-outputs headroom.pzwart.wdka.hro.nl:~/public_html/audio-library/media/',
  {stdio: 'inherit'});
  }
  catch(err) {
    console.log(err)
  }
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
