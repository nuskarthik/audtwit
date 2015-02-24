var express = require('express')
, passport = require('passport')
, util = require('util')
, TwitterStrategy = require('passport-twitter').Strategy
, session = require('express-session')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, config = require('./configuration/config')
, mongoose = require('mongoose')
, app = express(),
Twit = require('twit');

// Passport session setup.
passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(obj, done) {
done(null, obj);
});

//testing User

var UserSchema = new mongoose.Schema({
  provider: String,
  uid: String,
  name: String,
  image: String,
  created: {type: Date, default: Date.now}
});

mongoose.connect('mongodb://localhost/twitaud');
mongoose.model('User', UserSchema);

var User = mongoose.model('User');

//DEBUG
//console.log("CONFIG:"+JSON.stringify(config));
//console.log(config.host);
//console.log(config.twitter_api_key + " " + config.twitter_api_secret);

var tokenStore = "";
var tokenStoreSecret = "";
var screen_name = "";
var TwitObj = {};

passport.use(new TwitterStrategy({
	consumerKey: config.twitter_api_key,
	consumerSecret: config.twitter_api_secret ,
	callbackURL: config.callback_url,
	passReqToCallback: true
	},
	function(req, token, tokenSecret, profile, done) {
	User.findOne({uid: profile.id}, function(err, user) {
      tokenStore  = token;
      tokenStoreSecret = tokenSecret;
      screen_name = profile.screen_name;
      if(user) {
        done(null, user);
      } else {
        var user = new User();
        user.provider = "twitter";
        user.uid = profile.id;
        user.name = profile.displayName;
        user.image = profile._json.profile_image_url;
        user.save(function(err) {
          if(err) { throw err; }
          done(null, user);
        });

	}
  TwitObj = new Twit({
    consumer_key:         config.twitter_api_key
  , consumer_secret:      config.twitter_api_secret
  , access_token:         tokenStore
  , access_token_secret:  tokenStoreSecret
})

}

	)}));


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

//test material ui
app.get('/followers', function(req, res){

TwitObj.get('followers/list', { screen_name: screen_name },  function (err, data, response) {
  console.log(data)
  res.json(data);
});

});

app.get('/account', ensureAuthenticated, function(req, res){
res.render('account', { user: req.user });
});

app.get('/auth/twitter', passport.authenticate('twitter'),
  function(req, res) {
   //nothing
  });

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//start

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

