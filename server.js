const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

const db = require('./config/keys').mongoURI;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(console.log('connected to db'))
  .catch(e => console.log(`ERROR! --> ${e}`));

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport)

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/routes/api/posts', posts);

app.get('/', (req, res) => {
  res.send('hi');
});

const port = process.env.PORT || 5000;

app.listen(port, console.log(`server running on port ${port}`));
