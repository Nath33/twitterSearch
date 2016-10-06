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

var saveToken = false
var saveSecretToken = false
var token = '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y'
var secretToken = 'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'

program
	.version('1.0.0')
	.option('-s, --send', 'Say some things')

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
}else{
	program.help()
}