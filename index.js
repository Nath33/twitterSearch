#!/usr/bin/env node

// log twitter :
// login : BotTwit
// mdp : 33BotTwit

//access_token:         '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y',
//access_token_secret:  'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'

/*

TO DO

Fonction sauvegarde token

*/

// Implementation des modules
const program = require('commander')
const inquirer = require('inquirer')
const Twit = require('twit')
const path = require('path')
const fs = require('fs')

// Variables
var saveToken = false
var saveSecretToken = false
var token = '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y'
var secretToken = 'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'
var path_img = 'G:/Drive/Ingesup/Promo/Ing3/nodejs/twitterSearch' /////////////////////////////////////////////// Dossier de l'application

// Programme
program
	.version('1.0.0')
	.option('-n, --send', 'Say some things')
	.option('-o, --sendMedia', 'Say some things with some things')
	.option('-d, --hashtag, --limit', 'Search some things')
	.option('-e, --save', 'Save some things')
	.option('-j, --show', 'show some things')
	.option('-s, --delete', 'delete some things') /// ERREUR DROIT

program.parse(process.argv)

if (program.send) { ///////////////////////////////////////////////////////////////////////////////////////////// Envoi

	if (program.args != '') {
		// Questionnaire
		inquirer.prompt([
			{
				type: 'input',
				message: 'Entrez votre access token',
				name: 'token'
			},{
				type: 'input',
				message: 'Entrez votre access token secret',
				name: 'secretToken'
			}/*,{
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
			}*/
		]).then((answers) => {
			// Connexion a l'API
			var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token,
			  access_token_secret:  secretToken
			}

			var send = new Twit(config)
			// Envoi du tweet avec program.args qui est l'argument contenu dans la ligne de commande
			send.post('statuses/update', { status: program.args }, function(err, data, response) {
				console.log('Message envoyé')
			})
		}).catch((err) => {
			console.error(err)
		}) 
	}else{
		console.log('Erreur message vide')
	}
}else if(program.sendMedia){ ///////////////////////////////////////////////////////////////////////////////////////////// Envoi avec Media
		inquirer.prompt([
			{
				type: 'input',
				message: 'Entrez votre access token',
				name: 'token'
			},{
				type: 'input',
				message: 'Entrez votre access token secret',
				name: 'secretToken'
			}/*,{
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
			}*/
		]).then((answers) => {
			var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token,
			  access_token_secret:  secretToken
			}
		
			inquirer.prompt([
			{
				type: 'input',
				message: 'Tweet :',
				name: 'text'
			},{
				type: 'input',
				message: 'Nom de l\'image (ex: monimage.jpg)',
				name: 'img'
			}


			]).then((answers) => {

				var send = new Twit(config)
				// Chemin du media a envoyer
				var b64content = fs.readFileSync(path_img+'/images/'+answers.img, { encoding: 'base64' })
				// Envoi du tweet avec media
				send.post('media/upload', { media_data: b64content }, function (err, data, response) {
					var mediaIdStr = data.media_id_string
					var meta_params = { media_id: mediaIdStr }

					send.post('media/metadata/create', meta_params, function (err, data, response) {
						if (!err) {
							var params = { status: answers.text, media_ids: [mediaIdStr] }

							send.post('statuses/update', params, function (err, data, response) {
								console.log('Envoyé')
							})
						}
					})
				})

			})

		}).catch((err) => {
			console.error(err)
		})
}else if(program.hashtag){ ///////////////////////////////////////////////////////////////////////////////////////////// Recherche
	var config = {
	  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
	  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
	  access_token:         token, //answers.token,
	  access_token_secret:  secretToken //answers.secretToken
	}

	var send = new Twit(config)
	// Recherche
	send.get('search/tweets', { q: program.args, count: program.rawArgs[5] }, function(err, data, response) {
		for (var i = 0; i < program.rawArgs[5]; i++) {
		var tweets = data.statuses[i].text
			console.log("Tweet n° : " + (i+1) + " => " + tweets + "\n")
		}
	})

}else if(program.save){ ///////////////////////////////////////////////////////////////////////////////////////////// Sauvegarder n tweet dans un fichier

	var config = {
	  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
	  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
	  access_token:         token, //answers.token,
	  access_token_secret:  secretToken //answers.secretToken
	}

	var send = new Twit(config)
	var allTweets = ''
	// Recherche des tweet selon un maximum 'program.rawArgs[5]' 5 -> 5eme argumant
	send.get('search/tweets', { q: program.args, count: program.rawArgs[5] }, function(err, data, response) {
		for (var i = 0; i < program.rawArgs[5]; i++) {
			var tweets = data.statuses[i].text
			// Formalistation des tweets
			allTweets += 'Tweet n° : ' + (i+1) + ' => ' + tweets + '\n\r'
		}
	}).then(() => {
		try{
			//Ecriture dans le fichier
			fs.writeFile('tweet.txt', allTweets, (err) => {
				console.log('Fichier écrit')
			})
		}catch (err){
			console.log('ERR > ', err)
		}
	}).catch((err) => {
		console.error(err)
	})

}else if(program.show){ ///////////////////////////////////////////////////////////////////////////////////////////// Afficher 100 premiers tweet d'un compte
	var config = {
			  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
			  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
			  access_token:         token,
			  access_token_secret:  secretToken
			}

	var send = new Twit(config)

		inquirer.prompt([
		{
			type: 'input',
			message: 'Nom du compte',
			name: 'name'
		}
		]).then((answers, data) => {
			var options = { screen_name: answers.name, count: 100 };
			// Recherche avec answer.name qui sera le nom mis dans inquirer
			send.get('statuses/user_timeline', options , function(err, data) {
				for (var i = 0; i < data.length ; i++) {
					console.log('Tweet n° ' + (i+1) + ' => ' + data[i].text);
				}
			})
		})

}else if(program.delete){ ///////////////////////////////////////////////////////////////////////////////////////////// Suppression d'un tweet
	var config = {
		  consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
		  consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
		  access_token:         token,
		  access_token_secret:  secretToken
		}

	var send = new Twit(config)

	var options = { screen_name: 'BotTwit33', count: 100 };
	// Afficher les 100 premiers tweet du compte BotTwit33
	send.get('statuses/user_timeline', options , function(err, data) {
		for (var i = 0; i < data.length ; i++) {
			console.log('Tweet n° ' + i + ' => ' + data[i].text);    /////////////////Recherche de tous les tweets suivant 
		}
	
		inquirer.prompt([
		{
			type: 'input',
			message: 'Numéro de tweet',
			name: 'id'
		}
		]).then((answers) => {
			// Supprimer le tweet selectionner dans l'inquirer
			send.post('statuses/destroy/:id', { id:  data[answers.id].id_str}, function (err, data, response) {
				console.log('delete')
			})
		})
	})

}else{ ///////////////////////////////////////////////////////////////////////////////////////////// Help
	program.help()
}