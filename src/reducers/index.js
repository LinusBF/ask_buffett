/**
 * Created by Linus on 2018-06-10.
 */
import { combineReducers } from 'redux';
import responses from './responses';
import inputs from './inputs';

export default combineReducers({
    responses,
    inputs
})