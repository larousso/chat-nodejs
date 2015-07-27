import { EventEmitter } from 'events'
import assign from 'object-assign'
import $ from 'jquery'
import ChatDispatcher from '../dispatcher/ChatDispatcher'
import ActionsType from '../constant/ActionsType'

const CHANGE_EVENT = "CHANGE_EVENT";

var _messages = []; 
var _errors = [];
class MessageStore extends EventEmitter {

    constructor(){
        super();
    }

    emitChange = () => {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener = (callback) => {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener = (callback) => {
        this.removeListener(CHANGE_EVENT, callback);
    }

    getAllMessages = () => {
        return _messages;
    }

    getErrors = () => {
        return _errors;
    }

    sendMessage = (message) => {
        console.log("Saving message", message);
        $.ajax({
            url: "/api/chat/messages",
            method: "POST",
            data: JSON.stringify(message),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: data => {
                console.log("Message created", data)
            },
            failure: errMsg => {
                this.emitError(errMsg);
            }
        });
    }
}

let _MessageStore = new MessageStore();

ChatDispatcher.register( action => {
        switch (action.type) {
            case ActionsType.CREATE_MESSAGE:
                _MessageStore.sendMessage(action.message);
                break;

            default:
        }
    }
);


$.ajax({
	url: "/api/chat/messages",
	method: "GET",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: data => {
		_messages = data;
		_MessageStore.emitChange();
	},
	failure: errMsg => {
		console.log('Error loading message', errMsg);
	}
});

var source = new EventSource("/api/chat/messages/stream");
source.addEventListener('message', (msg) => {
	console.log('Message', msg);
	if(msg.data) {
		_messages.push(JSON.parse(msg.data));
		_MessageStore.emitChange();
	}
	
});
source.addEventListener('open', () => {
	console.log("SSE open");
});
source.addEventListener('close', () => {
	console.log("SSE closed");
});
export default _MessageStore;