var express = require('express')
, passport = require('passport')
, util = require('util')
, TwitterStrategy = require('passport-twitter').Strategy
, session = require('express-session')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, config = require('./configuration/config')
, mysql = require('mysql')
, app = express();

// Passport session setup.
passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(obj, done) {
done(null, obj);
});

//DEBUG
//console.log("CONFIG:"+JSON.stringify(config));
//console.log(config.host);
//console.log(config.twitter_api_key + " " + config.twitter_api_secret);

passport.use(new TwitterStrategy({
	consumerKey: config.twitter_api_key,
	consumerSecret: config.twitter_api_secret ,
	callbackURL: config.callback_url
	},
	function(token, tokenSecret, profile, done) {
		process.nextTick(function () {
		});
	}
	));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'teamie', key: 'karthik'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));


//CALLBACKS


app.get('/', function(req, res){
res.render('index', { user: req.user });
});

app.get('/test', function(req, res){
res.render('test', {});
});

app.get('/account', ensureAuthenticated, function(req, res){
res.render('account', { user: req.user });
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
passport.authenticate('twitter', { successRedirect : '/', failureRedirect: '/' }),
function(req, res) {
res.redirect('/');
});

app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/login')
}

app.listen(3000);
console.log("The magic starts at port 3000");

