//"use strict";

const autobahn = require('autobahn');
const events = require('events');
const util = require('util');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const AUTOBAHN_DEBUG = true;


class ProhashConnectionLib {
     
    constructor(config) {
        this.wampConnection = false;
	    this.wampUser = 'web';
	    this.wampPassword = 'web';
	    this.wampSession = false;
	    this.config = config;
        //this.subscribe = config.subscribe || 'all';
        this.url = 'wss://live.prohashing.com:443/ws';
        this.subscribe = 'all';
    }


    init() {
        //console.log('init');
        this.wampConnection = new autobahn.Connection({
            url: this.url,
            realm : 'mining',
            authmethods: ['wampcra'],
            authid: this.wampUser,
            onchallenge: this.onChallenge,
            onchallenge: function(session, method, extra){
                if (method == 'wampcra') {
                    console.log(extra.challenge);
                    //console.log(autobahn.auth_cra.sign('web', extra.challenge));
                    return autobahn.auth_cra.sign('web', extra.challenge);
                }
            }
        });

       
        

        this.wampConnection.onopen = this.connectionOpen;
        this.wampConnection.open();

        /*
        const conn = new autobahn.Connection({
            url: this.url,
            realm : 'mining',
            authmethods: ['wampcra'],
            authid: this.wampUser,
            onchallenge: this.onChallenge,
            onchallenge: function(session, method, extra){
                if (method == 'wampcra') {
                    console.log(extra.challenge);
                    //console.log(autobahn.auth_cra.sign('web', extra.challenge));
                    return autobahn.auth_cra.sign('web', extra.challenge);
                }
            }
        });

        
        
        conn.onopen = function(session){
            console.log(session);

            function initialProfitabilityUpdatesReceived(updates){
                console.log(updates);
            }

            function onProfitabilityUpdate(update) {
		
                console.log(update);
            }

           
            session.call('f_all_profitability_updates').then(initialProfitabilityUpdatesReceived);
            
            session.subscribe('profitability_updates', onProfitabilityUpdate);
        };

        conn.open();

        */

        
    }

    // onChallenge(session, method, extra){
    //     //console.log(session);
    //     this.wampSession = session;
    //     if (method == 'wampcra') {
    //         console.log(autobahn.auth_cra.sign('web', extra.challenge));
    //         return autobahn.auth_cra.sign(this.wampPassword, extra.challenge);
    //     }
    // }

    miners() {

    }
    

    profitability() {        
        //this.subscribe = 'profitability';
        this.init();
        //console.log('init');
        //this.close();
    }

    onProfitabilityUpdate(update) {
		
		if(update) {
			// res.setHeader('Content-Type', 'application/json');
			// res.json({profitability: update});
			// //profitability = update;
            // wampConnection.close('wss://live.prohashing.com:443/ws', 'closing connection');
            //return update;
            //console.log(update);
        }

        console.log(update);
		
	}

    close() {
        this.wampConnection.close(this.url, 'closing connection');
    }


    connectionOpen(session, details) {
        
        
        function initialProfitabilityUpdatesReceived(updates){
            console.log(updates);
        }

        function onProfitabilityUpdate(update) {
    
            console.log(update);
        }
        

        session.call('f_all_profitability_updates').then(initialProfitabilityUpdatesReceived);
            
        session.subscribe('profitability_updates', onProfitabilityUpdate);
       

       //session.call('f_all_profitability_updates').then(this.initialProfitabilityUpdatesReceived);
            
       //session.subscribe('profitability', this.onProfitabilityUpdate);

       //self.emit("profitability", update)
    }
    

    initialProfitabilityUpdatesReceived(updates){
        console.log(updates);
        //this.wampSession.subscribe('profitability_updates', onProfitabilityUpdate);
        //this.onProfitabilityUpdate(updates)
		//this.wampSession.subscribe('profitability_updates', this.onProfitabilityUpdate);
	}

    
	
	
}


/*
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const ProhashConnectionLib = function (config) {
	var self = this
	self.wampConnection = false
	self.wampUser = 'web'
	self.wampPassword = 'web'
	self.wampSession = false
	self.config = config
	self.subscribe = config.subscribe || 'all'

	if (config.debug) AUTOBAHN_DEBUG = true;
	const autobahn = require('autobahn')

	self.onChallenge = (session, method, extra) => {
		wampSession = session
		if (method == 'wampcra') {
			return autobahn.auth_cra.sign(self.wampPassword, extra.challenge);
		}
	}

	self.initialSessionUpdatesReceived = (updates) => {
		self.onMinerUpdate(updates)
		wampSession.subscribe(`miner_updates_${self.config.apiKey}`, self.onMinerUpdate)
	}

	self.initialProfitabilityUpdatesReceived = (updates) => {
		self.onProfitabilityUpdate(updates)
		wampSession.subscribe('profitability_updates', self.onProfitabilityUpdate);
	}

	self.initialSystemStatusUpdatesReceived = (updates) => {
		self.onSystemStatusUpdate(updates)
		wampSession.subscribe('general_updates', self.onSystemStatusUpdate);
	}

	self.connectionOpen = (session, details) => {
		if (self.subscribe.indexOf('miners') > -1 || self.subscribe == "all") wampSession.call('f_all_miner_updates', [self.config.apiKey]).then(self.initialSessionUpdatesReceived)
		if (self.subscribe.indexOf('profitability') > -1 || self.subscribe == "all") wampSession.call('f_all_profitability_updates').then(self.initialProfitabilityUpdatesReceived)
		if (self.subscribe.indexOf('systemStatus') > -1 || self.subscribe == "all") wampSession.call('f_all_general_updates').then(self.initialSystemStatusUpdatesReceived)
		if (self.subscribe.indexOf('blocks') > -1 || self.subscribe == "all") wampSession.subscribe('found_block_updates', self.onBlockUpdate);

		self.emit("connected", session, details)
	}

	self.onBlockUpdate = (block) => {
		self.emit("block", block)
	}

	self.onMinerUpdate = (update) => {
		self.emit("minerStatus", update)
	}

	self.onProfitabilityUpdate = (update) => {
		self.emit("profitability", update)
	}

	self.onSystemStatusUpdate = (update) => {
		self.emit("systemStatus", update)
    }
    
    self.close = () => {
        self.wampConnection.close('wss://live.prohashing.com:443/ws', 'connection close');
    }

	self.wampConnection = new autobahn.Connection({
		url: 'wss://live.prohashing.com:443/ws',
		realm: 'mining',
		authmethods: ['wampcra'],
		authid: self.wampUser,
		onchallenge: self.onChallenge,
	});

	self.wampConnection.onopen = self.connectionOpen
	self.wampConnection.open()

	return this
}
*/

util.inherits(ProhashConnectionLib, events.EventEmitter)
module.exports = ProhashConnectionLib;