import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(rootReducer, applyMiddleware(thunk));
console.log(process.env);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')
);
registerServiceWorker();
