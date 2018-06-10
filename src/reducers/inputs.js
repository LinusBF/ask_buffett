/**
 * Created by Linus on 2018-06-10.
 */

import { ADD_INPUT } from '../constants/actionTypes';

const inputs = (state = [], action) => {
    switch (action.type){
        case ADD_INPUT:
            return [
                ...state,
                {
                    date: new Date(),
                    content: action.payload,
                    userContent: true
                }
            ]
        default:
            return state
    }
}

export default inputs
