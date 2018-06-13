/**
 * Created by Linus on 2018-06-10.
 */

import { ADD_RESPONSE } from '../constants/actionTypes';

const responses = (state = [], action) => {
    switch (action.type){
        case ADD_RESPONSE:
            return [
                ...state,
                {
                    date: new Date(),
                    content: action.payload,
                    intent: action.intent,
                    userContent: false
                }
            ]
        default:
            return state
    }
};

export default responses
