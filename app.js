const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const routes = require('./routes/router.js')

app.use(express.static('public'))

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')


app.use(routes);

app.listen(3000, function (req, res) {
    console.log('Server up.')
})