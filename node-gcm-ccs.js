"use strict"

var xmpp = require('node-xmpp');
var Events = require('events').EventEmitter;
var crypto = require('crypto');

function client(projectId, apiKey) {
	var events = new Events();
	
	var client = new xmpp.Client({
		type: 'client',
		jid: projectId + '@gcm.googleapis.com',
		password: apiKey,
		port: 5235,
		host: 'gcm.googleapis.com',
		legacySSL: true,
		preferredSaslMechanism : 'PLAIN'
	});
	
	client.connection.socket.setTimeout(0);
	client.connection.socket.setKeepAlive(true, 10000);
	
	client.on('online', function() {
		console.log('on');
		events.emit('connected');
	});
	
	client.on('connection', function() {
		console.log('connected');
		events.emit('connected');
	});
	
	client.on('authenticate', function() {
		console.log('auth');
		events.emit('connected');
	});
	
	client.on('close', function() {
		console.log('close');
		events.emit('disconnected');
	});
	
	function _send(json) {
		var message = new xmpp.Element('message').c('gcm', { xmlns: 'google:mobile:data' }).t(JSON.stringify(json));
		client.send(message);
	}

	client.on('stanza', function(stanza) {
		if (stanza.is('message') && stanza.attrs.type !== 'error') {
			var data = JSON.parse(stanza.getChildText('gcm'));

			if (data && data.message_type != 'ack' && data.message_type != 'nack') {
				_send({
					to: data.from,
					message_id: data.message_id,
					message_type: 'ack'
				});
				
				events.emit('message', data);
			}/* else {
				Need to do something more here for a nack.
			}*/
		}
	});

	client.on('error', function(e) {
		console.log('fail on', arguments);
		events.emit('error', e);
	});
	
	function send(to, data, options) {
		var messageId = crypto.randomBytes(8).toString('hex');
		
		var data = {
			message_id: messageId,
			to: to,
			data: data
		};
		for (option in options)
			data[option] = options[option];
		
		_send(data);
		
		return messageId;
	}
	
	events.on('end', function() {
		client.end();
	});
	
	return events;
}

module.exports = client;