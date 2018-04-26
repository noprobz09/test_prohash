const express = require('express')
const { Readable  } = require('stream')
const app = express()
const autobahn = require('autobahn');
const events = require('events')
const util = require('util')
/*const prohashing = require("prohashing")
const connection = new prohashing({ 
    apiKey: "0a7a6fade943f7b6b9e96b4d1516bfcc733b5158af18d1b43aeec7e45a238c02", 
    debug: false ,
    subscribe : ['systemStatus', 'miners', 'profitability']
})*/

/*app.get('/profitability', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
    //res.send('hello world');
    
    const inStream = new Readable({});

    connection
    .on("profitability", (profitability) => {
	    //console.log("PROFITABLILITY UPDATE")
	    //console.log(profitability)
        //console.log(JSON.stringify(profitability[0]))
        
		res.send(JSON.stringify(profitability[0]));
		//res.json(profitability);
		//return callback(profitability);		


    })
    

})*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const AUTOBAHN_DEBUG = true;
app.get('/', (req, res) => {

	
	
	//console.log('test');

	//var wampConnection = null;
	var wampSession = false;
	const wampUser = 'web';
	const wampPassword = 'web';

	const profitability = [];


	const wampConnection = new autobahn.Connection({
		url: 'wss://live.prohashing.com:443/ws',
		realm : 'mining',
		authmethods: ['wampcra'],
		authid: wampUser,
		onchallenge: onChallenge
	});
	
	wampConnection.onopen = connectionOpen;
	wampConnection.open();
	

	
	 //If using node.js, the following code resolves an issue where the Electronic Frontier Foundation's free certificates are not trusted.
	//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";					
	
	function onChallenge(session, method, extra) {
		console.log(session);
		wampSession = session;
		if (method == 'wampcra') {
			return autobahn.auth_cra.sign(wampPassword, extra.challenge);
		}
	};
	
	function connectionOpen(session, details) {
		//console.log("connected", session, details)
		console.log('test');
		 //wampSession.subscribe('found_block_updates', onBlockUpdate);
		 //wampSession.call('f_all_miner_updates', ['a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8']).then(initialSessionUpdatesReceived);
		 
		 //wampSession.subscribe('miner_updates_a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8', onMinerUpdate);
		//wampSession.call('f_all_profitability_updates', ['a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8']).then(initialProfitabilityUpdatesReceived);

		//wampSession.call('f_all_miner_updates', ['a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8']).then(initialSessionUpdatesReceived)




		wampSession.call('f_all_profitability_updates').then(initialProfitabilityUpdatesReceived);
	};

	function initialProfitabilityUpdatesReceived(updates){
		//self.onProfitabilityUpdate(updates)
		wampSession.subscribe('profitability_updates', onProfitabilityUpdate);
	};

	function onProfitabilityUpdate(update) {
		//console.log("profitability", update)
		/*res.setHeader('Content-Type', 'application/json');
		res.json(update);*/
		console.log(wampSession);
		if( update ){
			res.setHeader('Content-Type', 'application/json');
			res.json({profitability: update});
			//profitability = update;
			wampConnection.close('wss://live.prohashing.com:443/ws', 'closing connection');
		}

		
	}
	
	function onBlockUpdate(block) {
		//Handle found blocks here.
	};
	
	function initialSessionUpdatesReceived(updates) {
	    //Handle the initial miner information here.
	    console.log(updates);
	    //After handling the initial information, now subscribe to receive future updates.	    
	    //wampSession.subscribe('miner_updates_a93f4d5311fed02a4e675d7995dbe6ba43bdc431926ce0e35553439f340aaef8', onMinerUpdate);
		//console.log('test')
	};
	
	function onMinerUpdate(update) {
	    //Handle live miner updates here.
	    console.log(update)
	};
    



});


app.listen(8082, () => console.log('Example app listening on port 8081!'))

