//testing User
mongoose = require('mongoose')
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

module.exports.UserSchema = UserSchema;
module.exports.FollowerSchema = FollowerSchema;