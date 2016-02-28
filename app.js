var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var fs = require('fs');

var dbUrl = 'mongodb://localhost/test'
mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath);
      }
    })
}
walk(models_path);
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(multipart());
app.use(session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;
  //mongoose.set('debug', true)
}

var routes = require('./config/routes');
app.use('/', routes);

app.listen(port);
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));

console.log('website started on port ' + port);
