var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var connection = require('./connect')

/* GET users listing. */
router.post('/signup', function (req, res) {
  const user = {
    'userid': req.body.user.userid,
    'name': req.body.user.name,
    'password': req.body.user.password
  };
  connection.query('SELECT userid FROM users WHERE userid = "' + user.userid + '"', function (err, row) {
    if (row[0] == undefined) {
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);
      connection.query('INSERT INTO users VALUES ("' + user.userid + '","' + user.name + '","' + encryptedPassword + '")', function (err, row2) {
        if (err) throw err;
      });
      res.json({
        success: true,
        message: 'Sing Up Success!'
      })
    }
    else {
      res.json({
        success: false,
        message: 'Sign Up Failed Please use anoter ID'
      })
    }
  });

});
router.post('/login', function (req, res) {
  const user = {
    'userid': req.body.user.userid,
    'password': req.body.user.password
  };

  connection.query('SELECT userid, password FROM users WHERE userid = ?', user.userid, function (err, result) {
    if (err) {
      throw err;
    } else {
      if (result[0] !== undefined && bcrypt.compareSync(user.password, result[0].password)) {
        res.json({
          success: true,
          message: 'success'
        })
      } else {
        res.json({
          success: false,
          message: 'fail'
        })
      }
    }
  })
});
router.get('/userlist', function (req, res) {
  connection.query('SELECT * FROM users', function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});
module.exports = router;
