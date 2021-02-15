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
require('dotenv').config()

// In this example we'll look at 2 ticker symbols but it can be extended in the future
let tickers = ['AAPL', 'TSLA']

// Requires a free API Key to use
const customUrl = new URL("https://api.twelvedata.com/time_series");

customUrl.searchParams.append("symbol", tickers.join(','));
customUrl.searchParams.append("interval", "1day");
customUrl.searchParams.append("apikey", process.env.API_KEY);

//console.log(customUrl.href);


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

