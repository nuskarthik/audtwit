var express = require('express')
, passport = require('passport')
, util = require('util')
, TwitterStrategy = require('passport-twitter').Strategy
, session = require('express-session')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, config = require('./configuration/config')
, mongoose = require('mongoose')
, testObj = require('./configuration/twubric')
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

var FollowerSchema = new mongoose.Schema({
      id: Number,
      id_str: String,
      name: String,
      screen_name: String,
      location: String,
      profile_location: String,
      url: String,
      description: String,
      protected: Boolean,
      followers_count: Number,
      friends_count: Number,
      listed_count: Number,
      created_at: Date,
      favourites_count: Number,
      utc_offset: String,
      time_zone: String,
      geo_enabled: Boolean,
      verified: Boolean,
      statuses_count: Number,
      profile_background_image_url: String,
      profile_image_url: String,
      default_profile: Boolean,
      default_profile_image: Boolean,
      following: Boolean,
      last_updated: Date,
      twubric: mongoose.Schema.Types.Mixed
});

mongoose.connect('mongodb://localhost/twitaud');
mongoose.model('User', UserSchema);
mongoose.model('Follower', FollowerSchema);

var User = mongoose.model('User');
var Follower = mongoose.model('Follower');

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
      tokenStore  = token;
      tokenStoreSecret = tokenSecret;
      screen_name = profile.screen_name;
	User.findOne({uid: profile.id}, function(err, user) {
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


next_cursor = null,
next_cursor_str = "",
previous_cursor = null,
previous_cursor_str = "";
flagfornext = false;
size = null;
docArray = [];

app.get('/followers/:key?', function(req, res){
 var key = req.params.key;
    if (key) {
      flagfornext = true;
    }
followData = null;

if(!flagfornext){
  params = { screen_name: screen_name };
}
else{
  params = { screen_name: screen_name, cursor: next_cursor }
}
TwitObj.get('followers/list', params ,  function (err, data, response) {
  //console.log(data);
  followData = data;

docArray = followData.users;
next_cursor = followData.next_cursor,
next_cursor_str = followData.next_cursor_str,
previous_cursor = followData.previous_cursor,
previous_cursor_str = followData.previous_cursor_str;
size = docArray.length;

//retrieveUserData();
saveToArray();
returnValue = {};
Follower.find({}, function(err, user){
  returnValue.users = user;
  res.send(returnValue);
});

});

});


singleUserDataObject = {};

function saveToArray(){
  follower = docArray.pop();
  if(follower){

  userparams = { screen_name: follower.screen_name };
  
  TwitObj.get('statuses/user_timeline/', userparams, function (error, userdata, userresponse){
    
    if(userdata!==undefined){
    lastUpdated = userdata[0].created_at;
    newcreatedAt = userdata[0].user.created_at;
    }
    else{
      console.log('ERROR:'+follower.screen_name);
    }

  Follower.findOne({id: follower.id}, function(err, user) {
      if(user) {
      } else {
      var user = new Follower();
        
      user.id = follower.id,
      user.id_str = follower.id_str,
      user.name = follower.name,
      user.screen_name = follower.screen_name,
      user.location = follower.location,
      user.profile_location = follower.profile_location,
      user.url = follower.url,
      user.description = follower.description,
      user.protected = follower.protected,
      user.followers_count = follower.followers_count,
      user.friends_count = follower.friends_count,
      user.listed_count = follower.listed_count,
      user.created_at = new Date(newcreatedAt),
      user.favourites_count = follower.favourites_count,
      user.utc_offset = follower.utc_offset,
      user.time_zone = follower.time_zone,
      user.geo_enabled = follower.geo_enabled,
      user.verified = follower.verified,
      user.statuses_count = follower.statuses_count,
      user.profile_background_image_url = follower.profile_background_image_url,
      user.profile_image_url = follower.profile_image_url,
      user.profile_use_background_image = follower.profile_use_background_image,
      user.default_profile = follower.default_profile,
      user.default_profile_image = follower.default_profile_image,
      user.following = follower.following;
      user.last_updated = new Date(lastUpdated);
      temp = follower;
      temp.last_updated = new Date(lastUpdated);
      temp.created_at = new Date(newcreatedAt);
      console.log(user.screen_name+':'+newcreatedAt+':'+lastUpdated);
      var result = testObj(temp);
      console.log(result);
      user.twubric = result;

        user.save(function(err) {
        if(err) { throw err; }
        if(--size){
          saveToArray();
        }
        });
      }
  });

});
}
} 



app.get('/followers/id/:user_id', function(req, res){
  output = {};
  check = parseInt(req.params.user_id);
  console.log(check);
  result = Follower.findOne( { id: check } , function(err, user){
    if(err){

    }
    if(user){
      output=user.toJSON();
    }
    res.send(output);
  });


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

