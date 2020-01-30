require('dotenv').config();

const app = require('express')(),
  PORT = process.env.PORT || 3001,
  { cron } = require('./helpers')

app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(require('express').json());
app.use(require('express').urlencoded({ extended: false }));

//development
// require('mongoose').connect(`mongodb://localhost/freelance-${process.env.NODE_ENV}`, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true })
//   .then(_ => console.log(`mongodb development now connected`, _.connections[0].name))
//   .catch(console.log)

// production
require('mongoose').connect(`mongodb+srv://ericsudhartio:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGODB_URL}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true })
  .then(_ => console.log('mongodb production now connected, name -> ', _.connections[0].name, ' : host ->', _.connections[0].host))
  .catch(console.log)

app.use('/', require('./routes'));

app.use(require('./middlewares').errorHandler);

app.listen(PORT, cron, _ => console.log(`Listening on PORT ${ PORT }`));

module.exports = app;