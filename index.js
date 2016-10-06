#!/usr/bin/env node

// log twitter :
// login : BotTwit
// mdp : 33BotTwit


//access_token:         '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y',
//access_token_secret:  'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'

const program = require('commander')
const inquirer = require('inquirer')
const Twit = require('twit')
const path = require('path')
const fs = require('fs')

var saveToken = false
var saveSecretToken = false
var token = '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y'
var secretToken = 'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'

program
	.version('1.0.0')
	.option('-n, --send', 'Say some things')
	.option('-o, --sendMedia', 'Say some things with some things')
	.option('-d, --hashtag, --limit', 'Search some things')
	.option('-e, --save', 'Save some things')

program.parse(process.argv)

if (program.send) {

	if (program.args != '') {
		inquirer.prompt([
			{
				type: 'input',
				message: 'Entrez votre access token',
				name: 'token'
			},{
				type: 'input',
				message: 'Entrez votre access token secret',
				name: 'secretToken'
			},{
				type: 'checkbox',
				message: 'Voulez-vous sauvegarder vos token ?',
				name: 'tokenToSave',
				choices: [
					'Token',
					'Token secret'
					]
			}
		]).then((answers) => {

			var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token, //answers.token,
			  access_token_secret:  secretToken //answers.secretToken
			}

			var send = new Twit(config)

			send.post('statuses/update', { status: program.args }, function(err, data, response) {
				console.log('Message envoyé')
			})
		}).catch((err) => {
			console.error(err)
		}) 
	}else{
		console.log('Erreur message vide')
	}
}else if(program.sendMedia){
		inquirer.prompt([
			{
				type: 'input',
				message: 'Entrez votre access token',
				name: 'token'
			},{
				type: 'input',
				message: 'Entrez votre access token secret',
				name: 'secretToken'
			},{
				type: 'checkbox',
				message: 'Voulez-vous sauvegarder vos token ?',
				name: 'tokenToSave',
				choices: [
					'Token',
					'Token secret'
					]
			}
		]).then((answers) => {
			var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token, //answers.token,
			  access_token_secret:  secretToken //answers.secretToken
			}
		
			var send = new Twit(config)
			var b64content = fs.readFileSync('G:/Drive/Ingesup/Promo/Ing3/nodejs/twitterSearch/images/1.jpg', { encoding: 'base64' })

			send.post('media/upload', { media_data: b64content }, function (err, data, response) {
				var mediaIdStr = data.media_id_string
				var altText = "Small flowers in a planter on a sunny balcony, blossoming."
				var meta_params = { media_id: mediaIdStr }

				send.post('media/metadata/create', meta_params, function (err, data, response) {
					if (!err) {
						var params = { status: program.args, media_ids: [mediaIdStr] }

						send.post('statuses/update', params, function (err, data, response) {
							console.log('Envoyé')
						})
					}
				})
			})

		}).catch((err) => {
			console.error(err)
		})
}else if(program.hashtag){
/*
	var config = {
	  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
	  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
	  access_token:         token, //answers.token,
	  access_token_secret:  secretToken //answers.secretToken
	}

	var send = new Twit(config)

	send.get('search/tweets', { q: program.args, count: program.rawArgs[5] }, function(err, data, response) {
		var tweets = data.statuses.text
		console.log(tweets)
	})
*/
}else if (program.save){
/*
	var config = {
	  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
	  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
	  access_token:         token, //answers.token,
	  access_token_secret:  secretToken //answers.secretToken
	}

	var send = new Twit(config)

	send.get('search/tweets', { q: program.args, count: 10 }, function(err, data, response) {
		var tweets = data.statuses.text
		console.log(tweets)
	})

	const fs = require('fs')

	try{
		fs.writeFile('tweet.txt', tweets, (err) => {
			if (err)
				throw err
				console.log('Fichier écrit')
		})
	}catch (err){
		console.log('ERR > ', err)
	}
*/
}else{
	program.help()
}