var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var { MongoClient } = require('mongodb')

// const appInsights = require('applicationinsights');
// appInsights.setup('1a4a5db6-5d45-4f2e-b046-7cf2f69bafb6')
// appInsights.start();

var index = require('./routes/index')
var users = require('./routes/users')
var admin = require('./routes/admin')
var detail = require('./routes/detail')
var edit = require('./routes/edit')
var del = require('./routes/delete')

var app = express()

// view engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)
app.use('/admin', admin)
app.use('/detail', detail)
app.use('/edit', edit)
app.use('/del', del)

// view details of one book
app.get('/details/:itemId', function (req, res) {
  const itemID = req.params.itemId
  const dbName = 'library'
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER;

  (async function mongo () {
    let client

    try {
      client = await MongoClient.connect(url, {
        auth: {
          user,
          password
        }
      })

      const db = client.db(dbName)
      const item = await db.collection('books').find({'bookId': parseFloat(itemID)}).toArray()
      console.log(item)
      res.render('detail', {item})
    } catch (err) {
      res.send(err)
    }
  }())
})

// edit details of one book
app.get('/edit/:itemId', function (req, res) {
  const itemID = req.params.itemId
  const dbName = 'library'
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER;

  (async function mongo () {
    let client

    try {
      client = await MongoClient.connect(url, {
        auth: {
          user,
          password
        }
      })

      const db = client.db(dbName)
      const item = await db.collection('books').find({'bookId': parseFloat(itemID)}).toArray()
      console.log(item)
      res.render('edit', {item})
    } catch (err) {
      res.send(err)
    }
  }())
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
