var Twit = require('twit');
var config = require('./config');
var rita = require('rita');

var T = new Twit(config);
var lexicon = new rita.RiLexicon;

console.log('----bot starting----');


generateTweet();

function generateTweet(){
	var NUM_PHRASES = 3;

	// var randNum = Math.floor(Math.random() * NUM_PHRASES) + 1;
	var randNum = 1;
	console.log(randNum);

	switch(randNum) {
    case 3:
      var output = skillsToPayTheBills();
      break;
    case 2:
      var output = noMoneyNoHoney();
      break;
    default:
			var output = dontDoThe();
	}

	var tweet = {
		status: output
	}

	console.log("generated output: " + output);
		
	// T.post('statuses/update', tweet, tweeted);

}

function skillsToPayTheBills(){

	var noun1 = lexicon.randomWord('nn');
	var verb1 = lexicon.randomWord('vb');

	var noun2 = getRhymingByPOS(noun1, 'nn');

	while(noun2 === false){
		//invalid rhyme, try again
		noun1 = lexicon.randomWord('nn');
		noun2 = getRhymingByPOS(noun1, 'nn');
	}

	noun1 = rita.RiTa.pluralize(noun1);
	noun2 = rita.RiTa.pluralize(noun2);
	var output = 'you gotta have ' + noun1 + ' to ' + verb1 + ' the ' + noun2;

	// console.log(output);

	return output;

}

function dontDoThe(){
	var verb1 = lexicon.randomWord('vb');
	var noun1 = lexicon.randomWord('nn');

	var verb2 = getRhymingByPOS(verb1, 'vb');
	var noun2 = getRhymingByPOS(noun1, 'nn');

	while(verb2 === false){
		//invalid rhyme, try again
		verb1 = lexicon.randomWord('vb');
		verb2 = getRhymingByPOS(verb1, 'vb');
	}
	while(noun2 === false){
		//invalid rhyme, try again
		noun1 = lexicon.randomWord('nn');
		noun2 = getRhymingByPOS(noun1, 'nn');
	}

	var output = 'dont ' + verb1 + ' the ' + noun1 + ' if you cant ' + verb2 + ' the ' + noun2;

	// console.log(output);

	return output;

}

function noMoneyNoHoney(){
	var noun1 = lexicon.randomWord('nn');
	var noun2 = getRhymingByPOS(noun1, 'nn');

	while(noun2 === false){
		//invalid rhyme, try again
		noun1 = lexicon.randomWord('nn');
		noun2 = getRhymingByPOS(noun1, 'nn');
	}

	var output = 'no ' + noun1 + ', no ' + noun2;

	return output;

}

function getRhymingByPOS(word, pos){
	console.log('getRhymingByPOS: ' + word);

	var allRhymes = lexicon.rhymes(word);
	var cleanedWords = [];

	if (allRhymes.length != 0) {
		for (var i = 0; i < allRhymes.length; i++) {
			if (pos == 'vb') {
				if (lexicon.isVerb(allRhymes[i])) {
					cleanedWords.push(allRhymes[i]);
				}
			}else{
				if (lexicon.isNoun(allRhymes[i])) {
					cleanedWords.push(allRhymes[i]);
				}
			}
		}
		if (cleanedWords.length == 0) {
			//no rhyming words with same part of speech
			console.log('could not find rhyme for: ' + word + ' as ' + pos);
			return false;
		}else{
			//pick word randomly from cleaned results
			var matchedRhyme = cleanedWords[Math.floor(Math.random() * cleanedWords.length)];
			console.log('rhymed: ' + word + ' with ' + matchedRhyme);
			return matchedRhyme;
		}
	}else{
		//no rhyming words at all
		console.log('could not find any rhymes for: ' + word);
		return false;
	}
}

function tweeted(err, data, response){
	// console.log(data)
	if (err) {
		console.log('something went wrong :(');
	}else{
		console.log('we tweeted!');
	}
}