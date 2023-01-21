# Bullshit-Talking-API

##  What is this?

Bullshit. Yes this is Bullshit. It was a train ride and I had nothing to do. So I started a random project in the two hours i was sitting in the train. A Web API that babbles at you with auto-generated bullshit.   

This is a simple node application that generates random sentences using a dataset of words organized by parts of speech. The dataset is taken from the submodules "English-word-lists-parts-of-speech-approximate" and "wordset-dictionary".
The code provided in this project has two versions of the Bullshit Generator: v1 and v2. The version of the generator that is used is determined by the path in the URL. When the user navigates to http://localhost:3000/v1, the BullshitGeneratorV1 class is used, and when the user navigates to http://localhost:3000/v2, the BullshitGeneratorV2 class is used. The two generators use different underlying data sets to generate the different words.

## How can i use this stuff?

Start with `npm start` and open `localhost:3000` to receive your daily dosis of bullshit. 
You can switch between the bullshit generator version by using the paths `/v1` or `/v2`. Using `/` automatically redirects to `/2`.

The query parameter quantity is used to specify the number of sentences that the application should generate when a user navigates to the /v1 or /v2 endpoints.

For example, if a user navigates to `http://localhost:3000/v2?quantity=3`, the application will generate 3 random sentences using the BullshitGeneratorV2 class, and return them to the user.
If the user navigates to `http://localhost:3000/v2` with no query parameter provided, the application will generate only one sentence.

You can add the query parameter to the end of the url by adding a ? followed by the parameter name and an = sign, then the desired value. In this case, `?quantity=3`

## How to add new sentences?

Oh you really want to spend more time poking around in this project?

To add new sentences to the application, you need to add them to the sentences array at the top of the index.js file.

The sentences array is an array of strings that represent the sentences that the application can generate. Each string in the array is a sentence template that includes placeholders for words of different parts of speech (e.g. "I really want to $verb this $noun!").

To add a new sentence to the array, you can simply add a new string to the array. For example, you could add the sentence "I love to $verb on the $noun".

## Afterthoughts

A big thank you goes out to the friend who invited me to his move and to whom I owe this train journey. Also to the Deutsche Bahn for a journey without complications and with good internet access. Finally, I also thank my own brain for this wonderful idea.   
  

It was an honor for me. And now I urgently need to do something useful again.