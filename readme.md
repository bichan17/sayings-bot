#Sayings bot

A twitter bot for things that they always say.

[@sayingsbot][twitterlink]

[made by eric bichan][website]

##setup
install dependencies with `npm install`

you will need a config.js file set up like 

```
module.exports= {
	consumer_key:         '...',
	consumer_secret:      '...',
	access_token:         '...',
	access_token_secret:  '...',
	timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
}
```

run with `npm start`


[twitterlink]: https://twitter.com/sayingsbot
[website]: http://ericbichan.com/