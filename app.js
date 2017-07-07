//const express = require('express');
//const app = express();


var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();

const mustacheExpress = require('mustache-express');
const routes = require('./routes/router.js')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// add validation methods to request
app.use(expressValidator({
    customValidators:{
      // this is a custom validator to flag an
      // error when a value is already in a given array
      isNotIn: function(value, array){
        var test = true;
        for (var i = 0; i < array.length; i++) {
          if (value.toUpperCase() == array[i]) {
            test = false;
          }
        }

        return test;
      },
      isDummy: function(value) {
        return value;
      }
    }
  }
));

app.use(express.static('public'))

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')


app.use(routes);

app.listen(3000, function (req, res) {
    console.log('Server up.')
})
