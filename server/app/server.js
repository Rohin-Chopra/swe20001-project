const app = require('./app');
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb://mongodb:27017/swe20001')
    console.log('Connected to the database')
  }
  catch (err) {
    console.log(err)
    console.log('Could not connect to the database')
  }
})()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`)
})