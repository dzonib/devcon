const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const db = require('./config/keys').mongoURI;

mongoose.connect(db,{ useNewUrlParser: true })
.then(console.log('connected to db'))
.catch((e) => console.log(`ERROR! --> ${e}`))

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hi')
})

const port = process.env.PORT || 5000;

app.listen(port, console.log(`server running on port ${port}`))