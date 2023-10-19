const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('./db')

const app = express()
const port = 3000

// Middleware to parse JSON request bodies
app.use(bodyParser.json())
app.use(cookieParser())

// Register routes
app.use('/password', require('./routes/password'))
app.use('/otp', require('./routes/otp'))
app.use('/otp', require('./routes/otp'))
app.use('/common', require('./routes/common'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
