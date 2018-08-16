let Twit = require('twit');
let config = require('./config');
let rita = require('rita');

let T = new Twit(config);
let lexicon = new rita.RiLexicon;

const NUM_PHRASES = 4;
const NUM_SYLLABLES = 3;
console.log('----bot starting----');


generateTweet();

function generateTweet(){
	let output = '';

	let num = Math.random();
	let randNum = Math.floor(num * NUM_PHRASES) + 1;

	let nounSyllableCount = Math.floor(Math.random() * NUM_SYLLABLES) + 1;
	let verbSyllableCount = Math.floor(Math.random() * NUM_SYLLABLES) + 1;

	console.log('noun count: ' + nounSyllableCount);
	console.log('verb count: ' + verbSyllableCount);


	switch(randNum) {
    case 4:
      output = friendIndeed(nounSyllableCount);
      break;
    case 3:
      output = skillsToPayTheBills(nounSyllableCount,verbSyllableCount);
      break;
    case 2:
      output = noMoneyNoHoney(nounSyllableCount);
      break;
    default:
			output = dontDoThe(nounSyllableCount,verbSyllableCount);
	}

	let tweet = {
		status: output
	}

	console.log("generated output: " + output);
		
	T.post('statuses/update', tweet, tweeted);

}

function skillsToPayTheBills(nounSyllableCount,verbSyllableCount){
	console.log('tweet format: skillsToPayTheBills');
	let noun1 = lexicon.randomWord('nn',nounSyllableCount);
	let verb1 = lexicon.randomWord('vb',verbSyllableCount);

	let noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);

	while(noun2 === false){
		//invalid rhyme, try again with new words + reduced syllables
		nounSyllableCount = reduceSyllableCount(nounSyllableCount);
		noun1 = lexicon.randomWord('nn',nounSyllableCount);
		noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);
	}

	noun1 = rita.RiTa.pluralize(noun1);
	noun2 = rita.RiTa.pluralize(noun2);
	let output = 'you gotta have ' + noun1 + ' to ' + verb1 + ' the ' + noun2;

	// console.log(output);

	return output;

}

function dontDoThe(nounSyllableCount,verbSyllableCount){
	console.log('tweet format: dontDoThe');

	let verb1 = lexicon.randomWord('vb',verbSyllableCount);
	let noun1 = lexicon.randomWord('nn',nounSyllableCount);

	let verb2 = getFilteredRhyme(verb1, 'vb',verbSyllableCount);
	let noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);

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

	let output = 'dont ' + verb1 + ' the ' + noun1 + ' if you cant ' + verb2 + ' the ' + noun2;

	// console.log(output);

	return output;

}

function noMoneyNoHoney(nounSyllableCount){
	console.log('tweet format: noMoneyNoHoney');
	let noun1 = lexicon.randomWord('nn',nounSyllableCount);
	let noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);

	while(noun2 === false){
		//invalid rhyme, try again with new words + reduced syllables
		nounSyllableCount = reduceSyllableCount(nounSyllableCount);
		noun1 = lexicon.randomWord('nn',nounSyllableCount);
		noun2 = getFilteredRhyme(noun1, 'nn',nounSyllableCount);
	}

	let output = 'no ' + noun1 + ', no ' + noun2;

	return output;

}

function friendIndeed(nounSyllableCount){
	//A friend with weed is a friend indeed.
	console.log('tweet format: friendIndeed');
	let noun1 = lexicon.randomWord('nn',nounSyllableCount);

	let noun2 = getFilteredRhyme('indeed', 'nn');

	let article = getNounArticle(noun1);


	let output = article + ' ' + noun1 + ' with ' + noun2 + ' is ' + article + ' ' + noun1 + ' indeed';

	return output;

}

function getNounArticle(noun){

	let vowels = ['a','e','i','o','u'];

	let article = 'a';

	noun = new rita.RiString(noun); 

	for (let i = 0; i < vowels.length; i++) {
		if (noun.startsWith(vowels[i])) {
			article = 'an';
		}
	}

	return article;
}

//syllable count optional
function getFilteredRhyme(word, pos, syllableCount){
	console.log('getFilteredRhyme: ' + word);

	let allRhymes = lexicon.rhymes(word);
	let cleanedWords = [];


	if (allRhymes.length != 0) {
		for (let i = 0; i < allRhymes.length; i++) {
			let string = allRhymes[i];
			let rs = new rita.RiString(string);
			rs.analyze();

			let stringFeatures = rs.features();
			let syllables = stringFeatures.syllables.split('/');
			let stringPos = stringFeatures.pos;

			if(stringPos === 'vbn' && pos === 'nn'){
				stringPos = 'nn';
			}
			if(stringPos === 'vbn' && pos === 'vb'){
				stringPos = 'vb';
			}

			if (typeof syllableCount !== 'undefined') {
				if (pos == stringPos && syllables.length == syllableCount) {
					cleanedWords.push(string);
				}
			}else{
				if (pos == stringPos) {
					cleanedWords.push(string);
				}
			}
		}
		if (cleanedWords.length == 0) {
			//no rhyming words with same part of speech
			console.log('could not find rhyme for: ' + word + ' as ' + pos);
			return false;
		}else{
			//pick word randomly from cleaned results
			let matchedRhyme = cleanedWords[Math.floor(Math.random() * cleanedWords.length)];
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
		count = NUM_SYLLABLES;
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