var Promise = require('promise');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var pg = require('pg');
var pg = require('pg');
var fs = require('fs');

var client = new pg.Client('postgres://alex:password@192.168.59.103/chat');
client.connect(function(err){
		if(err){
			console.log("Error connecting DB", err);
		} else {			
			var script =
				"CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" +
				"CREATE TABLE IF NOT EXISTS messages (id uuid primary key DEFAULT uuid_generate_v4(), author text not null, message text not null, timestamp timestamp DEFAULT current_timestamp); " +
				"CREATE OR REPLACE FUNCTION notify_messages() RETURNS trigger AS $$ BEGIN PERFORM pg_notify('notifications_messages', NEW.id || '###' || NEW.author || '###' || NEW.message|| '###' || NEW.timestamp); RETURN NULL; END; $$ LANGUAGE plpgsql;  " + 
				"DROP TRIGGER IF EXISTS trigger_notification ON messages ; " +
				"CREATE TRIGGER trigger_notification AFTER INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE notify_messages();  " +
				""
			;
			client.query(script, (err, res) => {
				if(err) {
					console.log("Erreur updating table", err);
				}
			});
			
		}
});
client.query('LISTEN "notifications_messages"');

var CHANGE_EVENT = "CHANGE_EVENT";

var MessageStore = assign({}, EventEmitter.prototype, {
	
	emitMessage: function(message) {
		this.emit(CHANGE_EVENT, message);
	},

	addMessageListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeMessageListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	
	getAll: () => {
		return new Promise(function (resolve, reject) {
			client.query('SELECT * FROM messages ORDER by timestamp asc;', (err, result) => {						
				if(err) {
					console.log("Erreur lors de la sauvegarde d'un message", message, err);
					reject(err);
				} else {					
					console.log("Tous les messages", result.rows);
					resolve(result.rows);
				}
			});
		});
	},
	save: (message) => {
		return new Promise(function (resolve, reject) {
			client.query("INSERT INTO messages (author, message) VALUES ('"+message.author+"', '"+message.message+"');", (err, result) => {			
				if(err) {
					console.log("Erreur lors de la sauvegarde d'un message", message, err);
					reject(err);
				} else {					
					console.log("Le message a �t� sauvegard� en base !", message);
					resolve(message);
				}
			});
		});
	}
});
client.on('notification', msg => {
	console.log("Notification", msg.payload)
	var m = msg.payload.split('###');
	MessageStore.emitMessage({id:m[0], author:m[1], message: m[2], timestamp:m[3]});
});

module.exports = MessageStore;