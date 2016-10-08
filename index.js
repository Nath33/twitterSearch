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
	.option('-j, --show', 'show some things')
	.option('-s, --delete', 'delete some things')

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
				type: 'expand',
				message: 'Voulez-vous sauvegarder vos token ?',
				name: 'tokenToSave',
				choices: [
					{
						key: 'O',
						name: 'Oui',
						value: 'yes'
					},
					{
						key: 'N',
						name: 'Non',
						value: 'no'
					}
				]
			}
		]).then((answers) => {
/*
			if (answers.tokenToSave == 'yes') {
				saveToken = true
				saveSecretToken = true
			}
*/
			var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token,
			  access_token_secret:  secretToken
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
				type: 'expand',
				message: 'Voulez-vous sauvegarder vos token ?',
				name: 'tokenToSave',
				choices: [
					{
						key: 'O',
						name: 'Oui',
						value: 'yes'
					},
					{
						key: 'N',
						name: 'Non',
						value: 'no'
					}
				]
			}
		]).then((answers) => {
			var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token,
			  access_token_secret:  secretToken
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
	var config = {
	  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
	  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
	  access_token:         token, //answers.token,
	  access_token_secret:  secretToken //answers.secretToken
	}

	var send = new Twit(config)

	send.get('search/tweets', { q: program.args, count: program.rawArgs[5] }, function(err, data, response) {
		for (var i = 0; i < program.rawArgs[5]; i++) {
		var tweets = data.statuses[i].text
			console.log("Tweet n° : " + (i+1) + " => " + tweets + "\n")
		}
	})

}else if (program.save){

	var config = {
	  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
	  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
	  access_token:         token, //answers.token,
	  access_token_secret:  secretToken //answers.secretToken
	}

	var send = new Twit(config)
	var allTweets = ''

	send.get('search/tweets', { q: program.args, count: program.rawArgs[5] }, function(err, data, response) {
		for (var i = 0; i < program.rawArgs[5]; i++) {
			var tweets = data.statuses[i].text
			allTweets += 'Tweet n° : ' + (i+1) + ' => ' + tweets + '\n\r'
		}
	}).then(() => {
		try{
			fs.writeFile('tweet.txt', allTweets, (err) => {
				if (err)
					throw err
					console.log('Fichier écrit')
			})
		}catch (err){
			console.log('ERR > ', err)
		}
	}).catch((err) => {
		console.error(err)
	})

}else if(program.show){
	var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token,
			  access_token_secret:  secretToken
			}

	var send = new Twit(config)
	var options = { screen_name: 'BotTwit33', count: 100 }; ////////////////////////////////Ajuster a un autre compte

	send.get('statuses/user_timeline', options , function(err, data) {
		for (var i = 0; i < data.length ; i++) {
			console.log('Tweet n° ' + i + ' => ' +data[i].text);
		}

	console.log(data)
	})

}else if(program.delete){
	var config = {
		  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
		  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
		  access_token:         token,
		  access_token_secret:  secretToken
		}

	var send = new Twit(config)


	var options = { screen_name: 'BotTwit33', count: 100 };
	send.get('statuses/user_timeline', options , function(err, data) {
		for (var i = 0; i < data.length ; i++) {
			console.log('Tweet n° ' + i + ' => ' +data[i].text);
		}
	}).then((data) => {
		inquirer.prompt([
		{
			type: 'input',
			message: 'Numéro de tweet',
			name: 'id'
		}
		]).then((answers, data) => {
			send.post('statuses/destroy/:id', { id:  data[answers.id].id_str}, function (err, data, response) {
				console.log('delete')
			})
		})
	})

}else{
	program.help()
}