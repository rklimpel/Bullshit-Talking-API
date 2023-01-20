const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

const sentences = [
	"I really want to $verb this $noun!",
	"I love this $noun, because i like how they $verb.",
	"$noun and $noun $preposition $pronoun",
	"Never again with this $noun! I want to $verb with it.",
];

const speech_parts = [
	"adverb",
	"adjective",
	"noun",
	"verb",
	"preposition",
	"interjection",
	"pronoun",
];

app.get("/", (req, res) => {
	try {
		res.send(getRandomSentence());
	} catch (err) {
		console.error(err);
		res.send(err);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

function fillSentencePlaceholder(sentence) {
	while (sentence.includes("$")) {
		speech_parts.forEach((sp) => {
			sentence = sentence.replace("$" + sp, getRandomWordBySpeechPart(sp));
		});
	}
	return sentence;
}

function getRandomSentence() {
	sentence = sentences[getRandomInt(0, sentences.length - 1)];
	return fillSentencePlaceholder(sentence);
}

function getRandomLetterDataset() {
	const data = fs.readFileSync(
		"./wordset-dictionary/data/" + getRandomLetter() + ".json",
		"utf8"
	);
	return JSON.parse(data);
}

function getRandomWordBySpeechPart(speechPart) {
	filtered = [];
	tries = 0;
	while (filtered.length === 0) {
		wordsData = getRandomLetterDataset();
		filtered = Object.keys(wordsData).filter(
			(w) =>
				wordsData[w]["meanings"] !== undefined &&
				wordsData[w]["meanings"].length !== 0 &&
				wordsData[w]["meanings"][0]["speech_part"] === speechPart
		);
		tries += 1;
		if (tries > 50) {
			return "???";
		}
	}
	return filtered[getRandomInt(0, filtered.length - 1)];
}

function getRandomWord() {
	wordsData = getRandomLetterDataset();
	let words = Object.keys(wordsData);
	return words[getRandomInt(0, words.length - 1)];
}

function getRandomLetter() {
	let letters = "abcdefghijklmnopqrstuvwxyz";
	return letters.charAt(getRandomInt(0, 25));
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
