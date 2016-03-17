var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var person = require('./routes/person.js');
var patronus = require('./routes/patronus.js');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgress://localhost:5432/patronus_database';
}

pg.connect (connectionString, function (err, client, done) {
  if (err) {
    console.log('Error connecting to DB!', err);
  } else {
    var patronusQuery = client.query('CREATE TABLE IF NOT EXISTS patronus (' +
                                      'patronus_id SERIAL PRIMARY KEY,' +
                                      'patronus_name varchar(80) NOT NULL );'
  );
    var personQuery = client.query('CREATE TABLE IF NOT EXISTS person (' +
                            'id SERIAL PRIMARY KEY,' +
                            'first_name varchar(80) NOT NULL' +
                            'last_name varchar(80)' +
                            'CONSTRAINT fk_patronus' +
                              'FOREIGN KEY (patronus_id)' +
                              'REFERENCES patronus(patronus_id));'
    );

    patronusQuery.on ('end', function () {
      console.log('Successfully ensured patronus schema exists.');
      done();
    });

    patronusQuery.on ('error', function () {
      console.log('Error patronus creating schema!');
      done();
    });

    personQuery.on ('end', function () {
      console.log('Successfully ensured person schema exists.');
      done();
    });

    personQuery.on ('error', function () {
      console.log('Error creating person schema!');
      done();
    });
  }
});

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/person', person);

app.use('/patronus', patronus);

app.get('/*', function(req, res){
  var file = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, './public/', file));
});

app.listen(port, function(){
  console.log('Listening on port: ' port);
});
