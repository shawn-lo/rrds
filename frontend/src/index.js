import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import registerServiceWorker from './registerServiceWorker';

import reducers from './reducers';
import createHistory from 'history/createBrowserHistory';
import { Route, Router } from 'react-router';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';
import reduxThunk from 'redux-thunk';

import IndexContainer from './containers/IndexContainer';
import LoginContainer from './containers/LoginContainer';
import AcctContainer from "./containers/AcctContainer";

const history = createHistory();
const middleware = (
    routerMiddleware(history),
    reduxThunk
);
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
var store = createStoreWithMiddleware(reducers);


ReactDOM.render(
    <Provider store={store}>
        { /* ConnectedRouter will use the store from Provider automatically */ }
        <ConnectedRouter history={history}>
            <div>
                <Route path="/" component={IndexContainer}/>
                <Route path="/acct" component={AcctContainer} />
                <Route path="/about" component={LoginContainer}/>
            </div>
        </ConnectedRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
