import ChatDispatcher from '../dispatcher/ChatDispatcher'
import ActionsType from '../constant/ActionsType'

export default {
    createMessage(message){
        ChatDispatcher.dispatch({
            type: ActionsType.CREATE_MESSAGE,
            message: message
        });
    }
}