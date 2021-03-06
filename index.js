#!/usr/bin/env node

// log twitter :
// login : BotTwit
// mdp : 33BotTwit

//access_token:         '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y',
//access_token_secret:  'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'

// Implementation des modules
const program = require('commander')
const inquirer = require('inquirer')
const Twit = require('twit')
const path = require('path')
const fs = require('fs')
const db = require('sqlite')

// Variables
var path_img = 'G:/Drive/Ingesup/Promo/Ing3/nodejs/twitterSearch' // Dossier de l'application

// Programme
program
	.version('1.0.0')
	.option('-n, --send', 'Say some things (ex: twit-feed -n "ma_recherche")')
	.option('-o, --sendMedia', 'Say some things with some things')
	.option('-d, --search, --limit', 'Search some things with limit')
	.option('-e, --save', 'Save some things')
	.option('-j, --show', 'Show some things')
	.option('-s, --delete', 'Delete some things')
	.option('-a, --showFile', 'Show file')
	.option('-b, --showBdd', 'Show Bdd')
	.option('-c, --deleteFile', 'Delete file')
	.option('-f, --deleteBdd', 'Delete Bdd')

program.parse(process.argv)

if (program.send) { ///////////////////////////////////// Envoi
	sendTweet()
}else if(program.sendMedia){ //////////////////////////// Envoi avec Media
	sendTweetMedia()
}else if(program.search){ /////////////////////////////// Recherche
	searchTweet()
}else if(program.save){ ///////////////////////////////// Sauvegarder n tweet dans un fichier
	saveTweet()
}else if(program.show){ ///////////////////////////////// Afficher 100 premiers tweet d'un compte
	showTweet()
}else if(program.delete){ /////////////////////////////// Suppression d'un tweet
	deleteTweet()
}else if(program.showFile){ ///////////////////////////// Afficher le fichier
	showFile()
}else if(program.showBdd){ ////////////////////////////// Afficher BDD
	showBdd()
}else if(program.deleteFile){ /////////////////////////// Supprime le fichier
	deleteFile()
}else if(program.deleteBdd){ //////////////////////////// Supprime BDD
	deleteBdd()
}else{ ////////////////////////////////////////////////// Help
	program.help()
}

// Connexion
function connexion(){
	var token = '783980343607062529-FAb5oDD3OG1zJ2JAOk6XUc0Yo3FcK8Y'
	var secretToken = 'bFTTsnq2S06BXX76B1Sw2iQDNa0VrofNiUxHtAh4pl9ZB'

	// Connexion a l'API
	var config = {
		consumer_key:         'hCMgwbuMtbzvm4DqygoXNz84T',
		consumer_secret:      'pzWmMsdrMayRqaLFdgSoGGBH759rdjREB82RmNX0Ux16RsVIkx',
		access_token:         token,
		access_token_secret:  secretToken
	}

	return conApi = new Twit(config)
}

function sendTweet(){
	conApi = connexion()
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
			}
		]).then((answers) => {
			// Envoi du tweet avec program.args qui est l'argument contenu dans la ligne de commande
			conApi.post('statuses/update', { status: program.args }, function(err, data, response) {
				console.log('Message envoyé')
			})
		}).catch((err) => {
			console.error(err)
		}) 
	}else{
		console.log('Erreur message vide')
	}
}

function sendTweetMedia(){
	conApi = connexion()
	inquirer.prompt([
		{
			type: 'input',
			message: 'Entrez votre access token',
			name: 'token'
		},{
			type: 'input',
			message: 'Entrez votre access token secret',
			name: 'secretToken'
		}
	]).then((answers) => {
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
			// Chemin du media a envoyer
			var b64content = fs.readFileSync(path_img+'/images/'+answers.img, { encoding: 'base64' })
			// Envoi du tweet avec media
			conApi.post('media/upload', { media_data: b64content }, function (err, data, response) {
				var mediaIdStr = data.media_id_string
				var meta_params = { media_id: mediaIdStr }
				conApi.post('media/metadata/create', meta_params, function (err, data, response) {
					if (!err) {
						var params = { status: answers.text, media_ids: [mediaIdStr] }
						conApi.post('statuses/update', params, function (err, data, response) {
							console.log('Envoyé')
						})
					}
				})
			})

		})

	}).catch((err) => {
		console.error(err)
	})
}

function searchTweet(){
	conApi = connexion()
	// Recherche
	inquirer.prompt([
		{
			type: 'input',
			message: 'Recherche :',
			name: 'text'
		},{
			type: 'input',
			message: 'limite :',
			name: 'limite'
		}
		]).then((answers) => {
			conApi.get('search/tweets', { q: answers.text, count: answers.limite }, function(err, data, response) {
				for (var i = 0; i < answers.limite; i++) {
				var tweets = data.statuses[i].text
					console.log("Tweet n° : " + (i+1) + " => " + tweets + "\n")
				}
			})
		})
}

function saveTweet(){
	conApi = connexion()
	var allTweets = ''
	inquirer.prompt([
		{
			type: 'input',
			message: 'Recherche :',
			name: 'text'
		},{
			type: 'input',
			message: 'limite :',
			name: 'limite'
		}
	]).then((answers) => {
		conApi.get('search/tweets', { q: answers.text, count: answers.limite }, function(err, data, response) {
			for (var i = 0; i < answers.limite; i++) {
			var tweets = data.statuses[i].text
				console.log("Tweet n° : " + (i+1) + " => " + tweets + "\n")
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
	})
}

function showTweet(){
	conApi = connexion()
	inquirer.prompt([
		{
			type: 'input',
			message: 'Nom du compte',
			name: 'name'
		}
	]).then((answers, data) => {
		var options = { screen_name: answers.name, count: 100 };
		// Recherche avec answer.name qui sera le nom mis dans inquirer
		conApi.get('statuses/user_timeline', options , function(err, data) {
			for (var i = 0; i < data.length ; i++) {
				console.log('Tweet n° ' + (i+1) + ' => ' + data[i].text);
			}
		})
	})
}

function deleteTweet(){
	conApi = connexion()
	var options = { screen_name: 'BotTwit33', count: 100 };
	// Afficher les 100 premiers tweet du compte BotTwit33
	conApi.get('statuses/user_timeline', options , function(err, data) {
		for (var i = 0; i < data.length ; i++) {
			console.log('Tweet n° ' + i + ' => ' + data[i].text); 
		}
		inquirer.prompt([
			{
				type: 'input',
				message: 'Numéro de tweet',
				name: 'id'
			}
		]).then((answers) => {
			// Supprimer le tweet selectionner dans l'inquirer
			conApi.post('statuses/destroy/:id', { id:  data[answers.id].id_str}, function (err, data, response) {
				console.log('delete')
			}).then(() => {
				saveBdd(data[answers.id].id_str)
			})
		})
	})
}

function saveBdd(id){
	db.open('deleteTweet.db').then(() => {
		return db.run('CREATE TABLE IF NOT EXISTS deleteTweet (idTweet, time)') // Créer la table si elle n'est pas déjà créer
	}).then(() => {
		var date = new Date()
		var fullDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() // Formate la date
		db.run('INSERT INTO deleteTweet(idTweet, time) VALUES (?, ?)', id, fullDate) // Insert dans la table deletetweet
	}).catch((err) => { 
		console.error('ERR> ', err)
	})
}

function showFile(){
	fs.readFile('tweet.txt', 'utf8', (err, data) => { // Lis le fichier tweet.txt
		if (err)
			throw err
		console.log('Donnée du fichier : \n' + data)
	})
}

function showBdd(){
	db.open('deleteTweet.db').then(() => {
	db.all('SELECT * FROM deleteTweet').then((result) => { // Select tous dans la table deleteTweet
			console.log(result)
		})
	}).catch((err) => { 
		console.error('ERR> ', err)
	})
}

function deleteFile(){
	fs.unlink('tweet.txt', (err) => { // Supprime le fichier tweet.txt
		if (err) throw err
		console.log('Fichier supprimé')
	})
}

function deleteBdd(){
	fs.unlink('deleteTweet.db', (err) => { // Supprime le fichier deletetweet.db
		if (err) throw err
		console.log('Base de donnée supprimé');
	})
}