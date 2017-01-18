var express = require('express');
var router = express.Router();

/* GET home page. */

var authenticate = function(req, res, next) {
	if(!req.session.username) return res.redirect('authenticate');
	next();
}

// router.get('/', authenticate, function(req, res, next) {
//   res.render('index', { title: 'Express', username: req.session.username });
// });

router.get('/', authenticate, function(req, res, next) {
  res.render('chatroom', { title: 'Express', username: req.session.username });
});

router.get('/authenticate', function(req, res, next) {
	res.render('authenticate', {title: 'Express'});
});



router.post('/authenticate', function(req, res, next) {
	req.session.username = req.body.username;
	return res.redirect('/');
});

module.exports = router;
