const express = require('express')
const env = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express()
env.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser());
app.use(morgan('dev'));


app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/user',require('./routes/user.routes.js'))
app.use('/api/captain',require('./routes/captain.routes.js'))

app.use('/api/maps',require('./routes/maps.routes.js'))
app.use('/api/ride',require('./routes/ride.routes.js'))


module.exports = app