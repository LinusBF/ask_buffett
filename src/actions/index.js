/**
 * Created by Linus on 2018-06-10.
 */

import { ADD_RESPONSE } from '../constants/actionTypes';
import { ADD_INPUT } from '../constants/actionTypes';
import { getResponse } from '../integration/market_api/MarketApi';

export const fetchResponse = (query) => {
    return function (dispatch) {
        return getResponse(query).then((response) => {
            console.log(response);
            dispatch(addResponse(response))
        })
    }
}

export const addResponse = responseData => {
    return {
        type: ADD_RESPONSE,
        payload: responseData
    }
}

export const addInput = inputData => {
    return {
        type: ADD_INPUT,
        payload: inputData
    }
}
