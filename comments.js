// Create web server
// Load the express library
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// Load the mysql library
const mysql = require('mysql');
// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'reddit'
});
connection.connect();

// GET /comments
app.get('/comments', function (req, res) {
  connection.query(
    `SELECT * FROM comments;`,
    function(err, results) {
      if (err) {
        console.log("Error fetching comments", err);
        res.status(500).send("Error fetching comments");
      } else {
        res.send(results);
      }
    }
  );
});

// POST /comments
app.post('/comments', function (req, res) {
  connection.query(
    `INSERT INTO comments (comment, post_id) VALUES (?, ?);`,
    [req.body.comment, req.body.post_id],
    function(err, results) {
      if (err) {
        console.log("Error inserting comment", err);
        res.status(500).send("Error inserting comment");
      } else {
        res.send("Inserted comment with id " + results.insertId);
      }
    }
  );
});

// PUT /comments/:id
app.put('/comments/:id', function (req, res) {
  connection.query(
    `UPDATE comments SET comment = ? WHERE id = ?;`,
    [req.body.comment, req.params.id],
    function(err, results) {
      if (err) {
        console.log("Error updating comment", err);
        res.status(500).send("Error updating comment");
      } else {
        res.send("Updated comment with id " + req.params.id);
      }
    }
  );
});

// DELETE /comments/:id
app.delete('/comments/:id', function (req, res) {
  connection.query(
    `DELETE FROM comments WHERE id = ?;`,
    [req.params.id],
    function(err, results) {
      if (err) {
        console.log("Error deleting comment", err);
        res.status(500).send("Error deleting comment");
      } else {
        res.send("Deleted comment with id " + req.params.id);
      }
    }
  );
});

// Start the web server on port 3000
app.listen