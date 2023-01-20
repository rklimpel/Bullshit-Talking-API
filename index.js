const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.get("/", (req, res) => {
	try {
		res.send('I just think about the word "' + getRandomWord() + '"');
	} catch (err) {
		console.error(err);
		res.send(err);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

function getRandomWord() {
	const data = fs.readFileSync(
		"./wordset-dictionary/data/" + getRandomLetter() + ".json",
		"utf8"
	);
	let wordsData = JSON.parse(data);
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
