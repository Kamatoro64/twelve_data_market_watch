// Working with data & APIs in JavaScript

/* Structure
	1) Call fetch (asynchronous) function 
		The fetch() method takes one mandatory argument, the path to the resource you want to fetch. It returns a Promise that resolves to the Response to that request, whether it is successful or not. You can also optionally pass in an init options object as the second argument (see Request).
			The Promise object represents the eventual completion (or failure) of an asynchronous operation/event and its resulting value.
				A Promise is in one of these states:
					pending: initial state, neither fulfilled nor rejected.
					fulfilled: meaning that the operation was completed successfully.
					rejected: meaning that the operation failed.
				A Promise gets resolved when the event is over
	2) Process response (Promise)-> The data is in the "body" of the response. text/blob/json
	3) Complete data stream
*/

const fetch = require("node-fetch");
const prompt = require('prompt');
require('dotenv').config()

// Program flow -> Prompt user for a list of space separated ticker symbols
prompt.start();
prompt.message = ""

prompt.get([{
	name: 'tickers',
	description: 'List of space separated tickers',
	type: 'string',
	required: true
}], async (err, input) => {
	if (err) { return onErr(err); }

	const url = constructUrl(input.tickers.split(' '))

	// Retrieve stock data. getStockData is an asynchronous function we created so we make the prompt's callback function into an async func
	// to use the await keyword here to resolve the promise
	const result = await getStockData(url).catch(error => {
		console.error(error)
	})

	// Process results (currently just displays the latest data in the values array)
	if (result.hasOwnProperty('meta')) {
		console.log(`${result.meta.symbol}: ${JSON.stringify(result.values[0])}`)
	} else {
		for (const ticker in result) {
			console.log(`${result[ticker].meta.symbol}: ${JSON.stringify(result[ticker].values[0])}`)
		}
	}
});

function onErr(err) {
	console.log(err);
	return 1;
}

// Prompt user for a list of tickers, build URL, get stock data, display!
function constructUrl(tickers, interval = '1min', outputSize = 30, apiKey = process.env.API_KEY) {

	const url = new URL("https://api.twelvedata.com/time_series");

	// Add tickers to query
	url.searchParams.append("symbol", tickers.join(','));

	// Set interval
	url.searchParams.append("interval", interval);

	// Set result count: 1 to 5000, Default is 30
	url.searchParams.append("outputsize", outputSize);

	// Add API Key
	url.searchParams.append("apikey", apiKey);

	return url
}

async function getStockData(url) { // By definition an asynchronous function returns a promise

	// DEBUG - Display URL passed to fetch
	//console.log(customUrl.href);

	// An await splits execution flow, allowing the caller of the async function to resume execution. After the await defers the continuation of the async function, execution of subsequent statements ensues. If this await is the last expression executed by its function execution continues by returning to the function's caller a pending Promise for completion of the await's function and resuming execution of that caller.

	const response = await fetch(url); // await required because fetch is an asynchronous function

	// Executes after await
	const result = await response.json()
	return result


}





/* Re-implemented with async await in getStockData
fetch(customUrl)
	.then(res => {
		// The result of res.json, which is a Promise
		return res.json()
	})
	.then(res => {
		for (const ticker in res) {
			console.log(`${res[ticker].meta.symbol}: ${JSON.stringify(res[ticker].values[0])}`)
		}
	})
	.catch(error => {
		console.log('Error!')
		console.error(error)
	})
*/