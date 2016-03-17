var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgress://localhost:5432/patronus_database';
}

router.post('/', function (req, res) {
  console.log('body', req.body);
  var patronus_name = req.body.patronus_name;

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log('Error connectiong to DB:', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO patronus (patronus_name) VALUES ($1)' +
                                ' RETURNING patronus_id, patronus_name', [patronus_name]);

      query.on('row', function(row){
        result.push(row);
        });
      query.on('end', function(){
        done();
        res.send(result);
      });
      query.on('error', function(error){
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.get('/', function(res, req){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log('Error connecting to DB', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT * FROM person;');

      query.on('row', function(row){
        result.push(row);
      });
      query.on('end', function(){
        done();
        res.send(result);
      });
      query.on('error', function(error){
        console.log('Error running query: ', error);
        done();
        res.staus(500).send(error);
      });
    }
  });
});







module.exports = router;
