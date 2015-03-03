To Run:
1. Install Node - brew install node
2. Install bower - npm install -g bower
3. Run npm update
4. Run bower install
5. Run the app as 
	node app.js

Implementation details:

Basically retrieved key follower data and also the user timeline for each follower (using twit module).

Based on that I calculate a score for
	
	1. friends(how many following vs followed - an indicator of bots) 
	2. influence(whether they have changed the default pic, got verified, had a tweet favorited, etc.)
	3. chirpiness(how active they are since they joined)
		TODO: modify to actually take into account the timestamps of recent activity
