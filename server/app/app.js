const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')
const logger = require('morgan')

const auth = require('./auth')
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/item')
const salesRouter = require('./routes/sale')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, './public')))
app.use(auth.initialise())

app.use('/api/auth', authRouter)
app.use('/api/items', itemsRouter)
app.use('/api/sales', salesRouter)
app.use('/api', (req, res, next) => {
  res.status(200).json({
    message: 'Welcome to the API'
  })
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send('error')
})

module.exports = app
