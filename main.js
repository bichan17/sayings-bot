var Twit = require('twit');
var config = require('./config');
var rita = require('rita');

var T = new Twit(config);
var lexicon = new rita.RiLexicon;

console.log('----bot starting----');


generateTweet();

function generateTweet(){
	var NUM_PHRASES = 3;
	var output = '';

	var num = Math.random();
	var randNum = Math.floor(num * NUM_PHRASES) + 1;

	var nounSyllableCount = Math.floor(Math.random() * 3) + 1;
	var verbSyllableCount = Math.floor(Math.random() * 3) + 1;

	console.log('noun count: ' + nounSyllableCount);
	console.log('verb count: ' + verbSyllableCount);




	switch(randNum) {
    case 3:
      output = skillsToPayTheBills(nounSyllableCount,verbSyllableCount);
      break;
    case 2:
      output = noMoneyNoHoney(nounSyllableCount);
      break;
    default:
			output = dontDoThe(nounSyllableCount,verbSyllableCount);
	}

	var tweet = {
		status: output
	}

	console.log("generated output: " + output);
		
	T.post('statuses/update', tweet, tweeted);

}

function skillsToPayTheBills(nounSyllableCount,verbSyllableCount){
	console.log('tweet format: skillsToPayTheBills');
	var noun1 = lexicon.randomWord('nn',nounSyllableCount);
	var verb1 = lexicon.randomWord('vb',verbSyllableCount);

	var noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);

	while(noun2 === false){
		//invalid rhyme, try again with new words + reduced syllables
		nounSyllableCount = reduceSyllableCount(nounSyllableCount);
		noun1 = lexicon.randomWord('nn',nounSyllableCount);
		noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);
	}

	noun1 = rita.RiTa.pluralize(noun1);
	noun2 = rita.RiTa.pluralize(noun2);
	var output = 'you gotta have ' + noun1 + ' to ' + verb1 + ' the ' + noun2;

	// console.log(output);

	return output;

}

function dontDoThe(nounSyllableCount,verbSyllableCount){
	console.log('tweet format: dontDoThe');

	var verb1 = lexicon.randomWord('vb',verbSyllableCount);
	var noun1 = lexicon.randomWord('nn',nounSyllableCount);

	var verb2 = getFilteredRhyme(verb1, 'vb',verbSyllableCount);
	var noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);

	while(verb2 === false){
		//invalid rhyme, try again with new words + reduced syllables
		verbSyllableCount = reduceSyllableCount(verbSyllableCount);
		verb1 = lexicon.randomWord('vb',verbSyllableCount);
		verb2 = getFilteredRhyme(verb1, 'vb',verbSyllableCount);
	}
	while(noun2 === false){
		//invalid rhyme, try again with new words + reduced syllables
		nounSyllableCount = reduceSyllableCount(nounSyllableCount);
		noun1 = lexicon.randomWord('nn',nounSyllableCount);
		noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);
	}

	var output = 'dont ' + verb1 + ' the ' + noun1 + ' if you cant ' + verb2 + ' the ' + noun2;

	// console.log(output);

	return output;

}

function noMoneyNoHoney(nounSyllableCount){
	console.log('tweet format: noMoneyNoHoney');
	var noun1 = lexicon.randomWord('nn',nounSyllableCount);
	var noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);

	while(noun2 === false){
		//invalid rhyme, try again with new words + reduced syllables
		nounSyllableCount = reduceSyllableCount(nounSyllableCount);
		noun1 = lexicon.randomWord('nn',nounSyllableCount);
		noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);
	}

	var output = 'no ' + noun1 + ', no ' + noun2;

	return output;

}

function getFilteredRhyme(word, pos, syllableCount){
	console.log('getFilteredRhyme: ' + word);

	var allRhymes = lexicon.rhymes(word);
	var cleanedWords = [];


	if (allRhymes.length != 0) {
		for (var i = 0; i < allRhymes.length; i++) {
			var string = allRhymes[i];
			var rs = new rita.RiString(string);

			rs.analyze();

			var stringFeatures = rs.features();

			var syllables = stringFeatures.syllables.split('/');


			if (pos == stringFeatures.pos && syllables.length == syllableCount) {
				cleanedWords.push(string);
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

function reduceSyllableCount(count){
	count--;
	if (count === 0) {
		count = 3;
	}
	console.log('new syllableCount: ' + count);
	return count;
}

function tweeted(err, data, response){
	// console.log(data)
	if (err) {
		console.log('something went wrong :(');
	}else{
		console.log('we tweeted!');
	}
}