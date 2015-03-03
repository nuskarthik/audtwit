
  function calculateRubric(user){
    var maxPoints = 10;
    var friendsScore = 2;
    var influenceScore = 4;
    var chirpyScore = 4;

    var scalePercentArray = [ 0.25, 0.5, 0.75 ];

    //console.log(user);

  //ratio
    var friendsCount = (1-(user.followers_count/user.friends_count))*friendsScore;
    friendsCount = Math.round(friendsCount*1000)/1000;
    if(friendsCount<0){
      friendsCount = 0;
    }

  //social activity
    var verify = user.verified;
    var followingBack = user.following;
    var listedCount = user.listedCount;
    var favCount = user.favourites_count;
    var noTweets = user.statuses_count;
    var influenceCount = 0;
    if(verify===true){
      influenceCount+=1;
    }
    if(followingBack===true){
      influenceCount+=1;
    }
    if(listedCount>0){
      influenceCount+=1;
    }
    if(favCount>0){
      influenceCount+=2;
    }
    if(noTweets>10){
      influenceCount+=2;
    }
    if(user.default_profile_image===false){
      influenceCount+=2;
    }
    if(user.profile_use_background_image===false){
      influenceCount+=1;
    }

    influenceCount = (influenceCount/10)*influenceScore;

  //account activity
  //ideally check number of tweets over last api call and their timestamps

   var updateLastDate = user.last_updated.getTime();
    var createDate  = user.created_at.getTime();


    var today = new Date();
    var todayMS = today.getTime()

    var diff1 = todayMS - updateLastDate;
    var diff2 = todayMS - createDate;
    console.log(diff1, diff2);
    var chirpyCount = (1 - diff1/diff2)*chirpyScore;
    chirpyCount = Math.round(chirpyCount*1000)/1000;

    var total = friendsCount+influenceCount+chirpyCount;

    var twubricObj = {
      "total": total,
      "friends": friendsCount,
      "influence": influenceCount,
      "chirpy": chirpyCount
    };

    return twubricObj;
  }
  module.exports = calculateRubric;
