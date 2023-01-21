const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

const sentences = [
	//	"I really want to $verb this $noun!",
	//	"I $verb this $noun, because i like how they $verb.",
	//	"Never again with this $noun! I want to $verb with it.",
	//	"Be careful $verb.",
	"$noun $verb the $adjective $noun $preposition the $noun $preposition the $noun.",
	"She $verb $adjective $preposition $noun.",
	"$noun adjective $noun $adverb $conjunction $verb $preposition $noun.",
	"It $noun a lot $preposition $noun $preposition $noun.",
	"My $noun $adverb $verb $preposition the $noun.",
];

const speech_parts = [
	"adverb",
	"adjective",
	"noun",
	"verb",
	"preposition",
	"interjection",
	"pronoun",
	"conjunction",
];

app.get("/", (req, res) => {
	res.redirect("./v2");
});

app.get("/v1", (req, res) => {
	handleRequest(req, res, new BullshitGeneratorV1());
});

app.get("/v2", (req, res) => {
	handleRequest(req, res, new BullshitGeneratorV2());
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

function handleRequest(req, res, generator) {
	console.log(req.query.id);
	try {
		if (req.query.quantity === undefined || req.query.quantity === 0) {
			res.send(getRequestAnswer(generator));
		} else {
			let answers = [];
			for (let index = 0; index < req.query.quantity; index++) {
				answers.push(getRequestAnswer(generator));
			}
			res.send(answers.join("</br>"));
		}
	} catch (err) {
		console.error(err);
		res.send(err);
	}
}

function getRequestAnswer(generator) {
	let sentence = generator.getRandomSentence();
	return capitalizeFirstLetter(sentence);
}

// Bullshit Generator using dataset from submodule "English-word-lists-parts-of-speech-approximate"
class BullshitGeneratorV2 {
	versionPath = "./English-word-lists-parts-of-speech-approximate";

	getRandomSentence() {
		const sentence = sentences[getRandomInt(0, sentences.length - 1)];
		return this.fillSentencePlaceholder(sentence);
	}

	fillSentencePlaceholder(sentence) {
		while (sentence.includes("$")) {
			speech_parts.forEach((sp) => {
				console.log(
					"Replace speeach part " + sp + " in sentence '" + sentence + "'"
				);
				sentence = sentence.replace(
					"$" + sp,
					this.getRandomWordBySpeechPart(sp)
				);
			});
		}
		return sentence;
	}

	getRandomWordBySpeechPart(speechPart) {
		let wordlist = [];
		if (speechPart === "noun") {
			wordlist = this.readWordlistFromDirectory("/nouns");
		} else if (speechPart === "verb") {
			wordlist = this.readWordlistFromDirectory("/verbs");
		} else if (speechPart === "adjective") {
			wordlist = this.readWordlistFromFile(
				this.versionPath + "/other-categories/mostly-adjectives.txt"
			);
		} else if (speechPart === "adverb") {
			wordlist = this.readWordlistFromFile(
				this.versionPath + "/other-categories/mostly-adverbs.txt"
			);
		} else if (speechPart === "conjunction") {
			wordlist = this.readWordlistFromFile(
				this.versionPath + "/other-categories/mostly-conjunctions.txt"
			);
		} else if (speechPart === "interjection") {
			wordlist = this.readWordlistFromFile(
				this.versionPath + "/other-categories/mostly-interjections.txt"
			);
		} else if (speechPart === "preposition") {
			wordlist = this.readWordlistFromFile(
				this.versionPath + "/other-categories/mostly-prepositions.txt"
			);
		} else if (speechPart === "pronoun") {
			return "???";
		}

		return wordlist[getRandomInt(0, wordlist.length - 1)];
	}

	readWordlistFromDirectory(directory) {
		let data = [];
		const directoryPath = path.join(__dirname, this.versionPath + directory);
		let files = fs.readdirSync(directoryPath);
		files.forEach((file) => {
			console.log("Found file: '" + file + "'");
			const wordlist = this.readWordlistFromFile(directoryPath + "/" + file);
			data = data.concat(wordlist);
		});
		return data;
	}

	readWordlistFromFile(filepath) {
		const data = fs.readFileSync(filepath, "utf8").toString().split("\n");
		return data;
	}
}

// Bullshit Generator using dataset from submodule "wordset-dicttionary"
class BullshitGeneratorV1 {
	getRandomSentence() {
		const sentence = sentences[getRandomInt(0, sentences.length - 1)];
		return this.fillSentencePlaceholder(sentence);
	}

	fillSentencePlaceholder(sentence) {
		while (sentence.includes("$")) {
			speech_parts.forEach((sp) => {
				sentence = sentence.replace(
					"$" + sp,
					this.getRandomWordBySpeechPart(sp)
				);
			});
		}
		return sentence;
	}

	getRandomWordBySpeechPart(speechPart) {
		let filtered = [];
		let tries = 0;
		while (filtered.length === 0) {
			let wordsData = this.getRandomLetterDataset();
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

	getRandomWord() {
		const wordsData = this.getRandomLetterDataset();
		let words = Object.keys(wordsData);
		return words[getRandomInt(0, words.length - 1)];
	}

	getRandomLetterDataset() {
		const data = fs.readFileSync(
			"./wordset-dictionary/data/" + getRandomLetter() + ".json",
			"utf8"
		);
		return JSON.parse(data);
	}
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

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
